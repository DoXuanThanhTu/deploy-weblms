import React, { useState } from "react";
import RichTextEditor from "../src/components/tool/MyRichText";

const App = () => {
  const initialContent = JSON.stringify({
    blocks: [
      {
        key: "initial0000",
        text: "Write something here ...",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 24,
            style: "ITALIC",
          },
          {
            offset: 0,
            length: 24,
            style: "COLOR_GRAY",
          },
        ],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  });

  const [content, setContent] = useState(initialContent);

  return (
    <div>
      <RichTextEditor onChange={setContent} initialContent={content} />
    </div>
  );
};

export default App;
