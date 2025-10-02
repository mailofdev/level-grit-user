// components/ImageRecognizer.js
import React, { useRef, useState, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const ImageRecognizer = ({ imageSrc, mode = "mobilenet", videoRef }) => {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageSrc && !videoRef) return;

    const runModel = async () => {
      setLoading(true);
      setResults([]);

      try {
        if (mode === "mobilenet") {
          const model = await mobilenet.load();
          const predictions = imageSrc
            ? await model.classify(imgRef.current)
            : await model.classify(videoRef.current);

          setResults(predictions);
        } else if (mode === "coco-ssd") {
          const model = await cocoSsd.load();

          const detect = async () => {
            let element = imageSrc ? imgRef.current : videoRef.current;

            if (
              !element ||
              (element.videoWidth === 0 && element.videoHeight === 0) ||
              (element.width === 0 && element.height === 0)
            ) {
              requestAnimationFrame(detect);
              return;
            }

            const predictions = await model.detect(element);

            if (canvasRef.current) {
              const ctx = canvasRef.current.getContext("2d");
              canvasRef.current.width = element.videoWidth || element.width;
              canvasRef.current.height = element.videoHeight || element.height;

              ctx.drawImage(element, 0, 0);

              predictions.forEach((p) => {
                ctx.strokeStyle = "#00FF00";
                ctx.lineWidth = 2;
                ctx.strokeRect(...p.bbox);

                ctx.fillStyle = "#00FF00";
                ctx.font = "16px Arial";
                ctx.fillText(
                  `${p.class} (${Math.round(p.score * 100)}%)`,
                  p.bbox[0],
                  p.bbox[1] > 10 ? p.bbox[1] - 5 : 10
                );
              });
            }

            setResults(predictions);
            if (!imageSrc) requestAnimationFrame(detect);
          };

          detect();
        }
      } catch (err) {
        console.error("Error in model:", err);
      }

      setLoading(false);
    };

    runModel();
  }, [imageSrc, videoRef, mode]);

  return (
    <div className="text-center my-3">
      {imageSrc || videoRef ? (
        <>
          {imageSrc && (
            <img
              ref={imgRef}
              src={imageSrc}
              crossOrigin="anonymous"
              alt="to-detect"
              style={{ display: "none" }}
              onLoad={() => {}}
            />
          )}
          {mode === "coco-ssd" ? (
            <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />
          ) : (
            <div>
              <img
                src={imageSrc}
                alt="preview"
                style={{ maxWidth: "100%" }}
              />
              {results.length > 0 && (
                <ul className="list-unstyled text-start">
                  {results.map((res, i) => (
                    <li key={i}>
                      {res.className
                        ? `${res.className} (${Math.round(
                            res.probability * 100
                          )}%)`
                        : `${res.class} (${Math.round(res.score * 100)}%)`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {loading && <p>🔄 Detecting...</p>}
        </>
      ) : (
        <p>No image or video provided</p>
      )}
    </div>
  );
};

export default ImageRecognizer;
