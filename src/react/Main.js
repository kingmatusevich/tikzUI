import React, { useState, useCallback } from "react";
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
} from "semantic-ui-react";
const BASE_FIGURE = {
  name: "",
};
function Main(props) {
  const { initialContent } = props;
  const [content, setContent] = useState(initialContent);
  const { figures, activeFigureIndex } = content;
  const [newFigureName, setNewFigureName] = useState("");
  const addFigure = useCallback(() => {
    if (newFigureName && newFigureName.length > 0) {
      setContent({
        ...content,
        figures: [...figures, { ...BASE_FIGURE, name: newFigureName }],
      });
      setNewFigureName("");
    }
  }, [newFigureName, figures, content]);
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
              color="blue"
              items={figures.map((a, idx) => ({
                name: a.name,
                key: idx,
                active: activeFigureIndex == idx,
              }))}
            />
            <div>
              <Input
                fluid
                inverted
                style={{ paddingLeft: 14 }}
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
        <Grid.Column stretched width={12}>
          <Segment basic>
            This is an stretched grid column. This segment will always match the
            tab height
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default Main;
