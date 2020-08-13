import React, { useState, useCallback, useEffect } from "react";
import {
  Container,
  Grid,
  Menu,
  Segment,
  Header,
  Button,
  Form,
  Input,
  Icon,
  Item,
} from "semantic-ui-react";
import { Document } from "react-pdf";
import CommandView from "./CommandView";
import { Figure, Command } from "./types/index";
import { channels } from "../shared/constants";
import { act } from "react-dom/test-utils";
const ipcRenderer = window.ipcRenderer || {
  on: () => {},
  send: () => {},
  removeAllListeners: () => {},
};

function Main(props) {
  const { initialContent } = props;
  const [content, setContent] = useState(initialContent);
  const { figures, activeFigureIndex } = content;
  const [pathToRender, setPathToRender] = useState(null);
  const [newFigureName, setNewFigureName] = useState("");
  const addFigure = useCallback(() => {
    if (newFigureName && newFigureName.length > 0) {
      let figure = new Figure(newFigureName);
      setPathToRender(null);
      setContent({
        ...content,
        figures: [...figures, figure],
        activeFigureIndex: figures.length,
      });
      setNewFigureName("");
    }
  }, [newFigureName, figures, content]);
  const activeFigure =
    activeFigureIndex != null ? figures[activeFigureIndex] : null;
  const addCommand = useCallback(() => {
    if (activeFigure) {
      let command = new Command("draw");
      let figure = activeFigure;
      figure.commands = [...figure.commands, command];
      setContent({
        ...content,
        figures: content.figures.map((a, idx) =>
          idx != activeFigureIndex ? a : figure
        ),
      });
      setNewFigureName("");
    }
  }, [content]);

  useEffect(() => {
    if (
      activeFigure &&
      activeFigure.commands.length > 0 &&
      activeFigure.commands[0].segments.length > 0 &&
      activeFigure.commands[0].segments[0].points.length > 0
    ) {
      window.ipcRenderer.send(
        channels.RENDER_FIGURE,
        activeFigure.latexRepresentation(true)
      );
    }
  }, [content]);

  useEffect(() => {
    ipcRenderer.on(channels.RENDER_FIGURE_COMPLETED, (e, path) => {
      console.log(path);
      setPathToRender(path);
    });
  }, []);

  // console.log("activeFigureIndex", activeFigureIndex, figures, activeFigure);
  return (
    <Container fluid>
      <Grid style={{ height: "100vh" }} compact>
        <Grid.Column width={4} stretched color="blue">
          <Segment basic style={{ paddingRight: 0 }}>
            <Header inverted style={{ marginLeft: 14 }}>
              Figures{" "}
            </Header>

            <Menu
              basic
              inverted
              fluid
              vertical
              attached
              key={content.activeFigureIndex}
              activeIndex={content.activeFigureIndex}
              color="blue"
              items={figures.map((a, idx) => ({
                name: a.name,
                key: idx,
                active: activeFigureIndex == idx,
                onClick: () => {
                  let nContent = content;
                  nContent.activeFigureIndex = idx;
                  console.log(nContent);
                  setPathToRender(null);
                  setContent({ ...nContent });
                },
              }))}
            />
            <div>
              <Input
                fluid
                inverted
                value={newFigureName}
                onChange={(e, { value }) => setNewFigureName(value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    addFigure();
                  }
                }}
                labelPosition="right"
                label={
                  <Button
                    icon="compose"
                    disabled={newFigureName.length <= 0}
                    onClick={addFigure}
                  />
                }
                placeholder="New Figure..."
              />
            </div>
          </Segment>
        </Grid.Column>
        <Grid.Column
          stretched
          width={6}
          style={{ height: "100vh", overflowY: "scroll" }}>
          {!activeFigure ? null : (
            <Segment basic>
              <Header>
                {activeFigure.name}
                <Button
                  icon="add"
                  floated="right"
                  circular
                  compact
                  color="blue"
                  onClick={addCommand}
                />
                <Header.Subheader>Commands</Header.Subheader>
              </Header>
              <Item.Group divided>
                {activeFigure.commands.map((aCommand, idx) => (
                  <CommandView
                    key={idx}
                    command={aCommand}
                    onChange={(command) => {
                      let figure = activeFigure;
                      figure.commands = figure.commands.map((a, i) =>
                        i != idx ? a : command
                      );
                      let nContent = {
                        ...content,
                        figures: content.figures.map((a, i) =>
                          i != activeFigureIndex ? a : figure
                        ),
                      };
                      console.log(nContent);
                      setContent(nContent);
                    }}
                  />
                ))}
              </Item.Group>
            </Segment>
          )}
        </Grid.Column>
        <Grid.Column
          stretched
          width={6}
          color="pink"
          style={{ display: "flex", paddingLeft: 0, paddingBottom: 0 }}>
          {!activeFigure ? null : (
            <Segment basic style={{ flex: 0 }}>
              <Header>
                {activeFigure.name}

                <Header.Subheader>Preview</Header.Subheader>
              </Header>
              <code style={{ whiteSpace: "pre-line" }}>
                {activeFigure.latexRepresentation(false)}
              </code>
            </Segment>
          )}
          {pathToRender ? (
            <iframe
              frameBorder="0"
              style={{ width: "100%", flex: 1, flexGrow: 2, padding: -10 }}
              src={"file://" + pathToRender}
              type="application/pdf"
            />
          ) : null}
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default Main;
