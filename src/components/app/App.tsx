import React from 'react';
import { Call } from 'wasm-imagemagick';
import { saveAs } from 'file-saver';

import './App.css';
import Button from '../button/Button';
import ReactCompareImage from 'react-compare-image';

const Magick = { Call };
const fileNames: string[] = ['bliss.png', 'tokopedia.png'];

const commandList = {
  rotate: {
    name: 'Rotate',
    cli: [
      'convert',
      '-rotate',
      '90',
      fileNames[0],
      'output.png'
    ], 
  },
  blur: {
    name: 'Blur',
    cli: [
      'convert',
      '-blur',
      '0x3',
      fileNames[0],
      'output.png'
    ], 
  },
  monochrome: {
    name: 'Monochrome',
    cli: [
      'convert',
      '-monochrome',
      fileNames[0],
      'output.png'
    ],
  },
  flip: {
    name: 'Flip',
    cli: [
      'convert',
      '-flip',
      fileNames[0],
      'output.png'
    ],
  },
  flop: {
    name: 'Flop',
    cli: [
      'convert',
      '-flop',
      fileNames[0],
      'output.png'
    ],
  },
  vignette: {
    name: 'Vignette',
    cli: [
      "convert",
      "-background",
      "black",
      "-vignette",
      "100x300",
      "bliss.png","output.png"
    ], 
  },
};

const App: React.FC = () => {
  const [outputName, setOutputName] = React.useState(null);
  const [outputBlob, setOutputBlob] = React.useState(null);
  const [outputBlobUrl, setOutputBlobUrl] = React.useState('');
  const [selectedCommand , setSelectedCommand] = React.useState(commandList.blur.cli);

  const handleSelectCommand = (event) => {
    const selectedValue = event.target.value;
    const selectedCli = commandList[selectedValue.toLowerCase()].cli;
    setSelectedCommand(selectedCli);
    console.log('~>', {selectedCli, selectedCommand});
  };

  // fetch the input image and get its content bytes
  const getImage = async (src: string): Promise<Uint8Array> => {
    let fetchedSourceImage;

    try {
      fetchedSourceImage = await fetch(src);
    } catch (error) {
      alert(error);
    }
 
    return new Uint8Array(await fetchedSourceImage.arrayBuffer());
  };

  const handleProcessImage = async () => { 
    let command: string[] = [];

    try {
      command = JSON.parse((document.getElementById('input-cli')! as HTMLTextAreaElement).value);
    } catch (error) {
      alert(error);
    }

    // Get image element where to load output images
    const outputImage = document.getElementById('outputImage')! as HTMLImageElement;

    const inputFiles = [
      {
        name: fileNames[0],
        content: await getImage(fileNames[0])
      },
    ];
    try {
      // Calling ImageMagick with one source image, and command to rotate & resize image
      // Response can be multiple files (example split) here we know we just have one
      const processedFiles = await Magick.Call(inputFiles, command);
      const firstOutputImage = processedFiles[0];
      const blobUrl = URL.createObjectURL(firstOutputImage.blob);
      outputImage.src = blobUrl;
      console.log('created image ', {firstOutputImage});
      setOutputName(firstOutputImage.name);
      setOutputBlob(firstOutputImage.blob);
      setOutputBlobUrl(blobUrl);
    } catch (error) {
      alert(error)
    }
  };

  const handleSaveAs = () => {
    saveAs(outputBlobUrl, outputName);
  };

  return (
    <div className="app">
      {
        true && 
        <div className="image-container" style={{ display: 'none' }}>
          <div>
            <p>Source</p>
            <img id="srcImage1" src={fileNames[0]} />
          </div>
          <div>
            <p>Result</p>
            <img id="outputImage" onClick={handleSaveAs} />
          </div>
        </div>
      }

      <ReactCompareImage leftImage={fileNames[0]} rightImage={outputBlobUrl} />

      <p>
        { outputBlob &&
          <Button onClick={handleSaveAs} disabled={outputBlob === null}>Download image</Button>
        }
      </p>

      <p>Select effect</p>
      <select onChange={handleSelectCommand}>
        {
          Object.keys(commandList).map(key => {
            const item = commandList[key];
            return (
            <option value={item.name} key={item.name}>{item.name}</option>
            )
          })
        }
      </select>

      { selectedCommand &&
        <div>
          <p>Raw command</p>
          <textarea
            style={{ width: '100%', height: '100px' }}
            id="input-cli"
            defaultValue={JSON.stringify(selectedCommand)}
            value={JSON.stringify(selectedCommand)}
            // onChange={handleTextAreaChange}
          />
        </div>
      }
      <p>
        <Button onClick={handleProcessImage}>Process Image</Button>
      </p>
    </div>
  );
};

export default App;
