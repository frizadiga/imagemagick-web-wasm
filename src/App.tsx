import React from 'react';
import * as Magick from 'wasm-imagemagick';

import './App.css';

const App: React.FC = () => {
  // const [inputValue, setInputValue] = useState();
  const fileNames: string[] = ['tokopedia.png'];

    // fetch the input image and get its content bytes
  async function getImage(src: string): Promise<Uint8Array> {
    let fetchedSourceImage1;

    try {
      fetchedSourceImage1 = await fetch(src);
    } catch (error) {
      alert(error);
    }
 
    return new Uint8Array(await fetchedSourceImage1.arrayBuffer());
  }

  async function handleProcessImage() { 
    let command: string[] = [];

    try {
      command = JSON.parse((document.getElementById('input')! as HTMLTextAreaElement).value);
    } catch (error) {
      alert(error);
    }

    // Get image element where to load output images
    const outputImage = document.getElementById('outputImage')! as HTMLImageElement;

    // Calling ImageMagick with one source image, and command to rotate & resize image
    const inputFiles = [
      {
        name: fileNames[0],
        content: await getImage(fileNames[0])
      },
    ];
    // console.log({ command: command.join('" "'), content: inputFiles[0].content });
    const processedFiles = await Magick.Call(inputFiles, command);

    // Response can be multiple files (example split) here we know we just have one
    const firstOutputImage = processedFiles[0];
    outputImage.src = URL.createObjectURL(firstOutputImage.blob);
    // console.log('created image ' + firstOutputImage.name);
  }

  const commandList = [
    [
      'convert', 'logo192.png',
      '(', '-clone', '0', 'logo512.png', '-compose', 'difference', '-composite',
      '-threshold', '5%', '-fill', 'red', '-opaque', 'white', '-transparent', 'black', ')',
      '-compose', 'over', '-composite', 'people_compare2.png'
    ],
    ['convert', fileNames[0], '-rotate', '70', 'output.png']
  ];

  return (
    <div className="app">
      <p>Command: </p>
      <textarea
        style={{ width: '100%', height: '100px' }}
        id="input"
        defaultValue={JSON.stringify(commandList[1])}
        // onChange={handleTextAreaChange}
      />
      <p>
        <button onClick={handleProcessImage}>Process Image</button>
      </p>

      <div className="image-container">
        <div>
          <p>Source image 1: </p>
          <img id="srcImage1" src="tokopedia.png" />
        </div>
        <div>
          <p>Result: </p>
          <img id="outputImage" />
        </div>
      </div>
    </div>
  );
};

export default App;
