import path from "path";
import fs from "fs";
import Jimp from "jimp";
import colorthief from "colorthief";

import Head from "next/head";

import Header from "components/header";
import Main from "components/main";
import Grid from "components/grid";
import Card from "components/card";
import Footer from "components/footer";

import { RawMetaDataJson, Images, MetaPromiseData, RGB } from "./index/types";
import { NTC, ntcToName } from "./index/ntc";

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

export default function Home(props: HomeProps) {
  return (
    <div className="root">
      <Head>
        <title>@kamontat/logo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header></Header>

      <Main>
        <Grid>
          {props.images.map((image, index) => {
            return <Card key={index} {...image}></Card>;
          })}
        </Grid>
      </Main>

      <Footer></Footer>
    </div>
  );
}

export async function getStaticProps() {
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
      const imageName = `${key}-${v.code}.${v.ext}`;
      const ipath = path.join(imageDirectory, imageName);

      const exist = fs.existsSync(ipath);
      if (!exist) {
        console.log(`cannot found ${ipath}`);
        return undefined;
      }

      let jimp = undefined;
      if (v.ext !== "svg") {
        jimp = await Jimp.read(ipath);
      }

      let color: RGB = undefined;
      let palette: RGB[] = undefined;
      if (v.ext !== "svg") {
        color = await colorthief.getColor(ipath);
        palette = await colorthief.getPalette(ipath);
      }

      const tags = v.tags.concat(key, v.code, v.ext);

      return {
        filename: imageName,
        ext: v.ext,
        size: v.size,
        jimp,
        color,
        rawColor: v.color,
        palette,
        rawPalette: v.palette,
        tags: tags,
        path: `images/${imageName}`,
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
      const palette = data.palette === undefined ? palette1 : data.palette.map((v) => ntc.name(toHex(v)));

      return {
        filename: data.filename,
        path: data.path,
        tags: data.tags,
        size: { width, height },
        metadata: { mime },
        ext,
        color,
        palette,
      };
    });

  // console.log(images);

  return {
    props: {
      images,
    },
  };
}
