import path from "path";
import fs from "fs";

import { useState, useEffect, useContext } from "react";

import { GetStaticProps } from "next";
import Head from "next/head";

import Header from "components/header";
import Main from "components/main";
import Grid from "components/grid";
import Card from "components/card";
import Footer from "components/footer";
import Modal from "components/modal";
import ActionBar from "components/actionbar";

import { Search } from "src/index/search";

import { Transformer } from "src/index/transformer";
import { loadMetadata } from "src/index/transform/loadMetadata";
import { loadImages } from "src/index/transform/loadImages";
import { loadImagesMetadata, ImagesMetadata } from "src/index/transform/loadImagesMetadata";
import { Logger } from "src/logger";
import GoogleTagManagerContext from "components/gtm";

interface HomeProps {
  images: ImagesMetadata[];
}

const logger = new Logger("index");
const searcher = new Search();

export default function Home(props: HomeProps) {
  searcher.add(props.images);

  const { dataLayer } = useContext(GoogleTagManagerContext);
  const [search, setSearch] = useState("");
  const [images, setImages] = useState(props.images);
  const [image, setImage] = useState(props.images[0]);
  const [modalShow, isModalShow] = useState(false);

  useEffect(() => {
    logger.i("search", `searching for ${search}`);
    if (search === "") setImages(props.images);
    else setImages(searcher.search(search));
  }, [search]);

  useEffect(() => {
    console.log(dataLayer);
  }, [dataLayer]);

  return (
    <div className="root">
      <Head>
        <title>@kamontat/logo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal show={modalShow} toggle={isModalShow} image={image}></Modal>
      <Header size={images.length} onSearch={setSearch}></Header>

      <Main>
        <Grid>
          {images.map((image, index) => {
            return <Card key={index} images={image} onClick={isModalShow} onSelect={setImage}></Card>;
          })}
        </Grid>
      </Main>

      <ActionBar></ActionBar>
      <Footer></Footer>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (_context) => {
  const metadataDirectory = path.join(process.cwd(), "public", "metadatav2");

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
