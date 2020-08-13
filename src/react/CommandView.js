import React, { useState, useCallback } from "react";
import {
  Form,
  Item,
  Segment,
  Checkbox,
  Input,
  Button,
} from "semantic-ui-react";
import { Segment as SegmentType, Point } from "./types/index";
const colorOptions = [
  { key: "black", text: "Black", value: "black" },
  { key: "white", text: "White", value: "white" },
];

const thicknessOptions = [
  { key: "thin", text: "Thin", value: 0.1 },
  { key: "thick", text: "Thick", value: 1 },
];

const styleOptions = [
  { key: "line", text: "Line", value: "line" },
  { key: "dashed", text: "Dashed", value: "dashed" },
  { key: "dotted", text: "Dotted", value: "dotted" },
];
function ColorPicker(props) {
  const [options, setOptions] = useState(colorOptions);
  const handleAddition = useCallback((e, { value }) => {
    setOptions((optList) => [...optList, { text: value, value, key: value }]);
  }, []);
  const { value, onChange } = props;
  return (
    <Form.Dropdown
      allowAdditions
      placeholder="Color"
      search
      selection
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
        <ThicknessPicker
          value={command.thickness}
          onChange={(thickness) => {
            let ncommand = command;
            ncommand.thickness = thickness;
            console.log(ncommand);
            onChange(ncommand);
          }}
        />
      </Form.Group>
      <Form.Group>
        <StylePicker
          value={command.style}
          onChange={(style) => {
            let ncommand = command;
            ncommand.style = style;
            console.log(ncommand);
            onChange(ncommand);
          }}
        />
        <Form.Button
          size="tiny"
          content="Add Segment"
          onClick={() => {
            let nCommand = command;
            nCommand.segments = [...command.segments, new SegmentType(false)];
            onChange(nCommand);
          }}
        />
      </Form.Group>
    </Form>
  );
}

function PointElement(props) {
  const { point, onChange } = props;
  return (
    <Form.Group>
      <Input
        size="mini"
        type="number"
        value={point.x}
        label="x"
        onChange={(e, { value }) => {
          onChange(new Point(Number(value), point.y));
        }}
      />
      <Input
        type="number"
        size="mini"
        value={point.y}
        label="y"
        onChange={(e, { value }) => {
          onChange(new Point(point.x, Number(value)));
        }}
      />
    </Form.Group>
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

        <Form.Group>
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
        </Form.Group>
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
