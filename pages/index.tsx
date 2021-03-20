import type { GetStaticProps } from "next";
import type { ImageData } from "src/interfaces/images";
import type { FileData } from "src/interfaces/metadata";

import path from "path";
import fs from "fs";

import { useState, useEffect, useContext } from "react";
import Head from "next/head";

import pjson from "package.json";

import Header from "components/header";
import Main from "components/main";
import Grid from "components/grid";
import Card from "components/card";
import Footer from "components/footer";
import Modal from "components/modal";
import ActionBar from "components/actionbar";
import GoogleTagManagerContext from "components/gtm";

import { Search } from "src/search";
import { Logger } from "src/logger";
import { DataFlow, loadImageData, loadMetadata, verifyImage } from "src/dataflow";


interface HomeProps {
  images: ImageData[];
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
        <title>{pjson.name}</title>
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

export const getStaticProps: GetStaticProps = async _context => {
  const imageUrl = path.join("images");

  const imageDirectory = path.join(process.cwd(), "public", imageUrl);
  const metadataDirectory = path.join(process.cwd(), "public", "metadata");

  const filenames = fs.readdirSync(metadataDirectory);

  const dataflow = DataFlow.new<FileData>({ metadataDirectory, imageDirectory, imageUrl, filenames });

  return {
    props: {
      images: await dataflow.async(loadMetadata).async(verifyImage).async(loadImageData).get(),
    },
  };
};
