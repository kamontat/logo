import path from "path";
import fs from "fs";

import { useState, useEffect } from "react";

import { GetStaticProps } from "next";
import Head from "next/head";

import Header from "components/header";
import Main from "components/main";
import Grid from "components/grid";
import Card from "components/card";
import Footer from "components/footer";

import { Search } from "src/index/search";
import { Transformer } from "src/index/transformer";

import { loadMetadata } from "src/index/transform/loadMetadata";
import { loadImages } from "src/index/transform/loadImages";
import { loadImagesMetadata, ImagesMetadata } from "src/index/transform/loadImagesMetadata";

interface HomeProps {
  images: ImagesMetadata[];
}

const searcher = new Search();
export default function Home(props: HomeProps) {
  searcher.add(props.images);

  const [search, setSearch] = useState("");
  const [images, setImages] = useState(props.images);

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
            return <Card key={index} images={image}></Card>;
          })}
        </Grid>
      </Main>

      <Footer></Footer>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (_context) => {
  const metadataDirectory = path.join(process.cwd(), "public", "metadata");

  const filenames = fs.readdirSync(metadataDirectory);

  const transformer = new Transformer(filenames);
  const metadataTransformer = transformer.transform(loadMetadata);
  const imagesTransformer = metadataTransformer.transform(loadImages);
  const imagesMetadataTransformer = imagesTransformer.transform(loadImagesMetadata);

  const images = await imagesMetadataTransformer.get();

  return {
    props: {
      images,
    },
  };
};
