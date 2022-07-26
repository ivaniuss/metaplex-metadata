import "./styles.css";
import { useEffect, useState } from "react";
import { Connection } from "@metaplex/js";
import { Account } from "@metaplex-foundation/mpl-core";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

import Card from "./components/Card";

const connection = new Connection("mainnet-beta");
const tokenAddress = "CxkKDaBvtHqg8aHBVY8E4YYBsCfJkJVsTAEdTo5k4SEw";

export default function App() {
  const [tokenAdr, setToken] = useState(tokenAddress);
  const [newToken, setNewToken] = useState(tokenAddress);
  const [data, setData] = useState(null);
  const [imageSrc, setImage] = useState(null);

  useEffect(() => {
    const loadImageData = async (uri) => {
      const response = await fetch(uri);
      const { image } = await response.json();
      setImage(image);
    };

    const getMetadata = async () => {
      const metadataPDA = await Metadata.getPDA(tokenAdr);
      const mintAccInfo = await connection.getAccountInfo(metadataPDA);

      const {
        data: { data: metadata }
      } = Metadata.from(new Account(tokenAddress, mintAccInfo));

      await loadImageData(metadata.uri);
      setData(metadata);
    };

    getMetadata();
  }, [tokenAdr]);

  return (
    <div className="App">
      <input
        value={newToken}
        onChange={(evt) => setNewToken(evt.target.value)}
        size="100"
      />
      <button onClick={() => setToken(newToken)}>Load metadata</button>
      {!data ? (
        "Loading..."
      ) : (
        <div>
          <Card imageSrc={imageSrc} text={data?.name} />
          <h2>Metadata</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
