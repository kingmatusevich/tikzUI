import React, { useState, useCallback } from "react";
import {
  Form,
  Item,
  Segment,
  Checkbox,
  Input,
  Button,
  Header,
  Accordion,
  Popup,
} from "semantic-ui-react";
import {
  Segment as SegmentType,
  Point,
  Colors,
  LineSizes,
  LineStyles,
  Shapes,
  TextPositions,
  TextAlign,
} from "./types/index";
const colorOptions = Colors;

const thicknessOptions = LineSizes;

const styleOptions = LineStyles;
function ColorPicker(props) {
  const [options, setOptions] = useState(colorOptions);
  const handleAddition = useCallback((e, { value }) => {
    setOptions((optList) => [...optList, { text: value, value, key: value }]);
  }, []);
  const { value, onChange } = props;
  return (
    <Form.Dropdown
      allowAdditions
      placeholder={props.placeholder || "Color"}
      search
      selection={props.secondary ? undefined : true}
      size={props.size}
      width={props.width}
      label={props.label}
      onAddItem={handleAddition}
      options={options}
      onChange={(e, { value: nValue }) => onChange(nValue)}
      value={value}
    />
  );
}

function ThicknessPicker(props) {
  const [options, setOptions] = useState(thicknessOptions);
  const handleAddition = useCallback((e, { value }) => {
    setOptions((optList) => [...optList, { text: value, value, key: value }]);
  }, []);
  const { value, onChange } = props;
  return (
    <Form.Dropdown
      allowAdditions
      placeholder="Thickness"
      search
      selection
      onAddItem={handleAddition}
      options={options}
      onChange={(e, { value: nValue }) => onChange(nValue)}
      value={value}
    />
  );
}

function StylePicker(props) {
  const [options, setOptions] = useState(styleOptions);
  const handleAddition = useCallback((e, { value }) => {
    setOptions((optList) => [...optList, { text: value, value, key: value }]);
  }, []);
  const { value, onChange } = props;
  return (
    <Form.Dropdown
      allowAdditions
      placeholder="Style"
      search
      selection
      onAddItem={handleAddition}
      options={options}
      onChange={(e, { value: nValue }) => onChange(nValue)}
      value={value}
    />
  );
}

function DrawCommandView(props) {
  const { command, onChange } = props;
  return (
    <Form size="tiny">
      <Form.Group>
        <ColorPicker
          value={command.color}
          onChange={(color) => {
            let ncommand = command;
            ncommand.color = color;
            console.log(ncommand);
            onChange(ncommand);
          }}
        />
        <ColorPicker
          value={command.fill}
          placeholder={"Fill"}
          onChange={(color) => {
            let ncommand = command;
            ncommand.fill = color;
            console.log(ncommand);
            onChange(ncommand);
          }}
        />
      </Form.Group>
      <Form.Group>
        <ThicknessPicker
          value={command.thickness}
          onChange={(thickness) => {
            let ncommand = command;
            ncommand.thickness = thickness;
            console.log(ncommand);
            onChange(ncommand);
          }}
        />
        <StylePicker
          value={command.style}
          onChange={(style) => {
            let ncommand = command;
            ncommand.style = style;
            console.log(ncommand);
            onChange(ncommand);
          }}
        />
      </Form.Group>
      <Header>
        <Form.Button
          icon="add"
          circular
          floated="right"
          color="blue"
          onClick={() => {
            let nCommand = command;
            nCommand.segments = [...command.segments, new SegmentType(false)];
            onChange(nCommand);
          }}
        />
        Segments{" "}
      </Header>
    </Form>
  );
}

function PointElement(props) {
  const { point, onChange } = props;
  const [viewDetails, setViewDetails] = useState(false);

  return (
    <Form>
      <Form.Group inline>
        <Form.Input
          size="mini"
          width="4"
          value={point.x}
          label="x"
          onChange={(e, { value }) => {
            if (value == "") {
              onChange(new Point(value, point.y));
              return;
            }
            if (!isNaN(value)) {
              onChange(new Point(Number(value), point.y));
            }
          }}
        />
        <Form.Input
          size="mini"
          width="4"
          value={point.y}
          label="y"
          onChange={(e, { value }) => {
            if (value == "") {
              onChange(new Point(point.x, value));
              return;
            }
            if (!isNaN(value)) {
              onChange(new Point(point.x, Number(value)));
            }
          }}
        />
        <Popup
          trigger={<Form.Button size="mini">Details</Form.Button>}
          header=""
          wide="very"
          content={
            <Form style={{ minWidth: 550 }}>
              <label>Shape</label>
              <Form.Group inline>
                <Form.Dropdown
                  label="Kind"
                  size="mini"
                  width="4"
                  options={Shapes}
                  value={point.node.shape}
                  placeholder="None"
                  onChange={(e, { value }) => {
                    let nPoint = point;
                    nPoint.node.shape = value;
                    onChange(nPoint);
                  }}
                />
                {point.node.shape != "circle" ? null : (
                  <Form.Input
                    type="text"
                    size="mini"
                    width="4"
                    value={point.node.radius}
                    label="Radius"
                    onChange={(e, { value }) => {
                      let nPoint = point;
                      nPoint.node.radius = value;
                      onChange(nPoint);
                    }}
                  />
                )}
                {point.node.shape == "none" ? null : (
                  <ColorPicker
                    value={point.node.fill}
                    placeholder="Fill"
                    secondary
                    label="Color"
                    width="4"
                    size="mini"
                    onChange={(color) => {
                      let nPoint = point;
                      nPoint.node.fill = color;
                      onChange(nPoint);
                    }}
                  />
                )}
              </Form.Group>
              <label>Label</label>
              <Form.Group inline>
                <Form.Input
                  type="text"
                  size="mini"
                  width="8"
                  value={point.node.text}
                  label="Text"
                  onChange={(e, { value }) => {
                    let nPoint = point;
                    nPoint.node.text = value;
                    onChange(nPoint);
                  }}
                />
                <Form.Dropdown
                  label="Align"
                  size="mini"
                  width="4"
                  value={point.node.TextAlign}
                  options={TextAlign}
                  placeholder="Align"
                  onChange={(e, { value }) => {
                    let nPoint = point;
                    nPoint.node.TextAlign = value;
                    onChange(nPoint);
                  }}
                />
                <Form.Dropdown
                  label="Position"
                  size="mini"
                  width="4"
                  value={point.node.textPosition}
                  options={TextPositions}
                  placeholder="Position"
                  onChange={(e, { value }) => {
                    let nPoint = point;
                    nPoint.node.textPosition = value;
                    onChange(nPoint);
                  }}
                />
              </Form.Group>
              <Form.Group inline>
                <Form.Checkbox
                  label="Equation"
                  checked={point.node.renderAsLatex}
                  onChange={(e, { value }) => {
                    let nPoint = point;
                    nPoint.node.renderAsLatex = value;
                    onChange(nPoint);
                  }}
                />
                <ColorPicker
                  value={point.node.color}
                  label="Color"
                  width="4"
                  size="mini"
                  secondary
                  onChange={(color) => {
                    let nPoint = point;
                    nPoint.node.color = color;
                    onChange(nPoint);
                  }}
                />
              </Form.Group>
            </Form>
          }
          on={["click"]}
        />
      </Form.Group>
    </Form>
  );
}

function SegmentElement(props) {
  const { segment, onChange } = props;
  return (
    <Item>
      <Item.Content>
        <Item.Header>
          <Form>
            <Form.Group>
              <Form.Checkbox
                toggle
                label="Curved"
                onChange={(value) => {
                  let nSegment = segment;
                  nSegment.curved = true;
                  onChange(nSegment);
                }}
              />
              <Button
                size="mini"
                content="Add Point"
                onClick={() => {
                  let nSegment = segment;
                  nSegment.points = [...nSegment.points, new Point(0, 0)];
                  onChange(nSegment);
                }}
              />
            </Form.Group>
          </Form>
        </Item.Header>

        {segment.points.map((aPoint, idx) => (
          <PointElement
            point={aPoint}
            onChange={(p) => {
              let nSegment = segment;
              nSegment.points = nSegment.points.map((ap, j) =>
                j != idx ? ap : p
              );
              onChange(nSegment);
            }}
          />
        ))}
      </Item.Content>
    </Item>
  );
}

function Command(props) {
  const { command, onChange } = props;

  return (
    <Item>
      <Item.Content>
        <Form>
          <Form.Group>
            <Form.Dropdown
              selection
              placeholder="Type of command..."
              onChange={(e, { value }) => {
                let nCommand = command;
                nCommand.type = value;
                onChange(nCommand);
              }}
              value={command.type}
              options={[
                { key: "draw", text: "Draw", value: "draw" },
                { key: "raw", text: "raw", value: "raw" },
              ]}
            />
          </Form.Group>
        </Form>
        {command.type != "draw" ? null : (
          <DrawCommandView command={command} onChange={onChange} />
        )}
        <Segment basic>
          <Item.Group>
            {command.segments.map((aSegment, idx) => (
              <SegmentElement
                segment={aSegment}
                key={idx}
                onChange={(segment) => {
                  let newCommand = command;
                  newCommand.segments = command.segments.map((a, i) =>
                    i != idx ? a : segment
                  );
                  onChange(newCommand);
                }}
              />
            ))}
          </Item.Group>
        </Segment>
      </Item.Content>
    </Item>
  );
}

export default Command;
