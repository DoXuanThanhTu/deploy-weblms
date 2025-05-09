import React, { useState, useRef } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
  CompositeDecorator,
  Modifier,
  AtomicBlockUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";
import styled from "styled-components";

const StyledLinkWrapper = styled.span`
  position: relative;

  &:hover span.tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.span`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-color: #eaeaea;
  padding: 6px 10px;
  border-radius: 4px;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 12px;
  z-index: 10;

  &::after {
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -6px;
    border-width: 6px;
    border-style: solid;
  }
`;

const Container = styled.div`
  max-width: 700px;
  margin: 20px auto;
  font-family: "Arial", sans-serif;
`;

const Toolbar = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Button = styled.button`
  padding: 6px 12px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #e0e0e0;
  }
`;

const EditorContainer = styled.div`
  min-height: 150px;
  border: 1px solid #ccc;
  padding: 10px;
  background: #fff;
  cursor: text;
`;

const Output = styled.pre`
  background: #f9f9f9;
  padding: 15px;
  margin-top: 20px;
  border-left: 4px solid #00bcd4;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const Title = styled.h2`
  color: #333;
`;

const ColorMenu = styled.select`
  padding: 6px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
`;

const Media = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src, type } = entity.getData();

  // Nhận diện link YouTube
  const isYouTube = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/.test(src);

  if (isYouTube) {
    // Lấy Video ID để nhúng
    const match = src.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]+)/);
    const videoId = match ? match[1] : null;

    if (videoId) {
      return (
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&cc_load_policy=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video"
        ></iframe>
      );
    }
  }

  if (type === "image") {
    return <img src={src} style={{ maxWidth: "100%" }} alt="image" />;
  } else if (type === "video") {
    return (
      <video controls style={{ maxWidth: "100%" }} src={src}>
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
};

const blockRendererFn = (block) => {
  if (block.getType() === "atomic") {
    return {
      component: Media,
      editable: false,
    };
  }
  return null;
};

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  const handleClick = (e) => {
    if (e.ctrlKey || e.metaKey) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <StyledLinkWrapper onClick={handleClick}>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={{ color: "blue", textDecoration: "underline" }}
      >
        {props.children}
      </a>
      <Tooltip className="tooltip">
        Ctrl + Left Click to Follow link:{" "}
        <span style={{ textDecoration: "underline", color: "blue" }}>
          {url}
        </span>
      </Tooltip>
    </StyledLinkWrapper>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

const RichTextEditor = ({ onChange, initialContent }) => {
  const editorRef = useRef(null);

  const [editorState, setEditorState] = useState(() => {
    if (initialContent) {
      try {
        const content = convertFromRaw(JSON.parse(initialContent));
        return EditorState.createWithContent(content, decorator);
      } catch {
        return EditorState.createEmpty(decorator);
      }
    }
    return EditorState.createEmpty(decorator);
  });

  const [rawContent, setRawContent] = useState("");

  const promptForLink = () => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const url = window.prompt("Enter a URL:");
      if (url) {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          "LINK",
          "MUTABLE",
          { url }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.push(
          editorState,
          contentStateWithEntity,
          "apply-entity"
        );
        setEditorState(
          RichUtils.toggleLink(newEditorState, selection, entityKey)
        );
      }
    } else {
      alert("Please select text to apply the link.");
    }
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
    const content = convertToRaw(state.getCurrentContent());
    const stringified = JSON.stringify(content, null, 2);
    setRawContent(stringified);
    if (onChange) onChange(stringified);
  };

  const insertMedia = (type) => {
    const url = window.prompt(`Enter ${type} URL or leave empty to upload:`);
    if (url) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        "MEDIA",
        "IMMUTABLE",
        {
          src: url,
          type,
        }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        EditorState.set(editorState, {
          currentContent: contentStateWithEntity,
        }),
        entityKey,
        " "
      );
      setEditorState(newEditorState);
    } else {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = type === "image" ? "image/*" : "video/*";
      input.onchange = async () => {
        const file = input.files[0];
        if (file) {
          const previewUrl = URL.createObjectURL(file);
          const contentState = editorState.getCurrentContent();
          const contentStateWithEntity = contentState.createEntity(
            "MEDIA",
            "IMMUTABLE",
            {
              src: previewUrl,
              type,
              file,
              isLocal: true,
            }
          );
          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
          const newEditorState = AtomicBlockUtils.insertAtomicBlock(
            EditorState.set(editorState, {
              currentContent: contentStateWithEntity,
            }),
            entityKey,
            " "
          );
          setEditorState(newEditorState);
        }
      };
      input.click();
    }
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEditorChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInlineStyle = (style) => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const undo = () => handleEditorChange(EditorState.undo(editorState));
  const redo = () => handleEditorChange(EditorState.redo(editorState));

  const isInlineStyleActive = (style) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return currentStyle.has(style);
  };

  const changeColor = (color) => {
    const currentStyle = `COLOR_${color.toUpperCase()}`;
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, currentStyle));
  };

  const styleMap = {
    COLOR_RED: { color: "red" },
    COLOR_GREEN: { color: "green" },
    COLOR_BLUE: { color: "blue" },
    COLOR_YELLOW: { color: "yellow" },
    COLOR_ORANGE: { color: "orange" },
    COLOR_PURPLE: { color: "purple" },
    COLOR_PINK: { color: "pink" },
    COLOR_BROWN: { color: "brown" },
    COLOR_GRAY: { color: "gray" },
    COLOR_BLACK: { color: "black" },
    COLOR_WHITE: { color: "white" },
    COLOR_CYAN: { color: "cyan" },
    COLOR_MAGENTA: { color: "magenta" },
    COLOR_LIME: { color: "lime" },
    COLOR_TEAL: { color: "teal" },
    COLOR_AQUA: { color: "aqua" },
  };

  const handleSave = () => {
    const content = convertToRaw(editorState.getCurrentContent());
    console.log("Prepare to upload local media and save:", content);
    // 1. Detect local media with isLocal === true
    // 2. Upload to ImageKit (simulate)
    // 3. Replace src in content state
    // 4. Save final content to database
  };

  return (
    <Container>
      <Title>📝 Rich Text Editor</Title>
      <Toolbar>
        <Button onClick={() => toggleInlineStyle("BOLD")}>B</Button>
        <Button onClick={() => toggleInlineStyle("ITALIC")}>I</Button>
        <Button onClick={() => toggleInlineStyle("UNDERLINE")}>U</Button>
        <Button onClick={() => toggleBlockType("header-two")}>H2</Button>
        <Button onClick={() => toggleBlockType("header-three")}>H3</Button>
        <Button onClick={promptForLink}>Insert Link</Button>
        <Button onClick={() => insertMedia("image")}>Insert Image</Button>
        <Button onClick={() => insertMedia("video")}>Insert Video</Button>
        <ColorMenu onChange={(e) => changeColor(e.target.value)}>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="yellow">Yellow</option>
          <option value="orange">Orange</option>
          <option value="purple">Purple</option>
          <option value="pink">Pink</option>
          <option value="brown">Brown</option>
          <option value="gray">Gray</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="cyan">Cyan</option>
          <option value="magenta">Magenta</option>
          <option value="lime">Lime</option>
          <option value="teal">Teal</option>
          <option value="aqua">Aqua</option>
        </ColorMenu>
        <Button onClick={undo}>Undo</Button>
        <Button onClick={redo}>Redo</Button>
        <Button onClick={handleSave}>Save</Button>
      </Toolbar>
      <EditorContainer onClick={() => editorRef.current?.focus()}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={(e) => {
            if (e.key === "z" && (e.ctrlKey || e.metaKey)) return "undo";
            if (e.key === "y" && (e.ctrlKey || e.metaKey)) return "redo";
            return getDefaultKeyBinding(e);
          }}
          customStyleMap={styleMap}
          blockRendererFn={blockRendererFn}
        />
      </EditorContainer>
      <Output>{rawContent}</Output>
    </Container>
  );
};

export default RichTextEditor;
