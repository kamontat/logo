import path from "path";
import fs from "fs";

import Jimp from "jimp";
import colorthief from "colorthief";

import { useState, useEffect } from "react";

import { GetStaticProps } from "next";
import Head from "next/head";

import Header from "components/header";
import Main from "components/main";
import Grid from "components/grid";
import Card from "components/card";
import Footer from "components/footer";

import { RawMetaDataJson, Images, MetaPromiseData, RGB } from "src/index/types";
import { NTC, ntcToName } from "src/index/ntc";
import { Search } from "src/index/search";

const toHex = (rgb: RGB) => {
  const hex = rgb.map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  });

  return `#${hex.join("").toUpperCase()}`;
};

interface HomeProps {
  images: Images[];
}

const searcher = new Search();
export default function Home(props: HomeProps) {
  searcher.add(props.images);

  const [search, setSearch] = useState("");
  const [images, setImages] = useState(props.images);
  // const router = useRouter();
  // console.log(router.query);

  useEffect(() => {
    if (search === "") setImages(props.images);
    else setImages(searcher.search(search));
  }, [search]);

  return (
    <div className="root">
      <Head>
        <title>@kamontat/logo ({images.length})</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header size={images.length} onSearch={setSearch}></Header>

      <Main>
        <Grid>
          {images.map((image, index) => {
            return <Card key={index} {...image} filtering={search}></Card>;
          })}
        </Grid>
      </Main>

      <Footer></Footer>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (_context) => {
  const ntc = new NTC(false);

  const imageDirectory = path.join(process.cwd(), "public", "images");
  const metadataDirectory = path.join(process.cwd(), "public", "metadata");

  const filenames = fs.readdirSync(metadataDirectory);

  const metadata = filenames.flatMap((filename) => {
    const key = path.basename(filename, ".json");
    const fpath = path.join(metadataDirectory, filename);
    const raw = fs.readFileSync(fpath, "utf8");
    const json = JSON.parse(raw) as RawMetaDataJson;

    // transform image to jimp object
    const images: MetaPromiseData[] = json.images.map(async (v) => {
      const imageName = `${v.code}.${v.ext}`;
      const ipath = path.join("images", key, imageName);
      const fullipath = path.join(imageDirectory, key, imageName);

      const exist = fs.existsSync(fullipath);
      if (!exist) {
        console.log(`cannot found ${fullipath}`);
        return undefined;
      }

      let jimp = undefined;
      if (v.ext !== "svg") {
        jimp = await Jimp.read(fullipath);
      }

      let color: RGB = undefined;
      let palette: RGB[] = undefined;
      if (v.ext !== "svg") {
        color = await colorthief.getColor(fullipath);
        palette = await colorthief.getPalette(fullipath);
      }

      // const tags = v.tags.concat(key, v.code, v.ext);

      return {
        filename: imageName,
        ext: v.ext,
        size: v.size,
        jimp,
        color,
        rawColor: v.color,
        palette,
        rawPalette: v.palette,
        tags: v.tags,
        path: ipath,
      };
    });

    return images;
  });

  const result = await Promise.all(metadata);
  const images: Images[] = result
    .filter((v) => v !== undefined)
    .map((data) => {
      // console.log(data.jimp);
      const width = data.size?.width ?? data.jimp?.getWidth() ?? 0;
      const height = data.size?.height ?? data.jimp?.getHeight() ?? 0;
      const mime = data.jimp?.getMIME() ?? data.ext;
      const ext = data.jimp?.getExtension() ?? data.ext;

      const color1 = ntcToName(data.rawColor ?? "");
      const color = data.color === undefined ? color1 : ntc.name(toHex(data.color));

      const palette1 = (data.rawPalette ?? []).map((v) => ntcToName(v));
      const palette =
        data.palette === undefined
          ? palette1
          : data.palette.map((v) => ntc.name(toHex([v[0] - 1, v[1] - 1, v[2] - 1])));

      return {
        filename: data.filename,
        path: data.path,
        tags: data.tags,
        size: { width, height },
        metadata: { mime },
        ext,
        color,
        palette: palette.slice(0, 7),
      };
    });

  return {
    props: {
      images,
    },
  };
};
