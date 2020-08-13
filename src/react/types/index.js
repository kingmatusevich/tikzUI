let prefix = `
    \\documentclass[crop,tikz]{standalone}
    \\tikzstyle{line}=[draw]
    \\begin{document}
    `;

let suffix = `
    \\end{document}
    `;

export const LineDecorators = [
  { value: "->", key: "arrow-right", icon: "arrow right" },
  { value: "<-", key: "arrow-left", icon: "arrow left" },
  { value: "|->", key: "end-arrow-right", icon: "end arrow right" },
  { value: "<-|", key: "end-arrow-left", icon: "end arrow left" },
  {
    value: "<->",
    key: "arrow-bidirectional",
    icon: "bidirectional arrow",
  },
  {
    value: "|-|",
    key: "end-line-end",
    icon: "double ended line",
  },
];

export const LineStyles = [
  { value: "dashed", text: "- - - ", key: "dashed" },
  { value: "dotted", text: ". . . .", key: "dotted" },
  { value: "line", text: "Normal", key: "line" },
];

export const Colors = [
  { value: "red", key: "red", text: "Red", color: "red" },
  { value: "green", key: "green", text: "Green", color: "green" },
  { value: "blue", key: "blue", text: "Blue", color: "blue" },
  { value: "cyan", key: "cyan", text: "Cyan", color: "cyan" },
  { value: "magenta", key: "magenta", text: "Magenta", color: "magenta" },
  { value: "yellow", key: "yellow", text: "Yellow", color: "yellow" },
  { value: "black", key: "black", text: "Black", color: "black" },
  { value: "gray", key: "gray", text: "Gray", color: "gray" },
  { value: "darkgray", key: "darkgray", text: "Dark Gray", color: "darkgray" },
  {
    value: "lightgray",
    key: "lightgray",
    text: "Light Gray",
    color: "lightgray",
  },
  { value: "brown", key: "brown", text: "Brown", color: "brown" },
  { value: "lime", key: "lime", text: "Lime", color: "lime" },
  { value: "olive", key: "olive", text: "Olive", color: "olive" },
  { value: "orange", key: "orange", text: "Orange", color: "orange" },
  { value: "pink", key: "pink", text: "Pink", color: "pink" },
  { value: "purple", key: "purple", text: "Purple", color: "purple" },
  { value: "teal", key: "teal", text: "Teal", color: "teal" },
  { value: "violet", key: "violet", text: "Violet", color: "violet" },
  { value: "white", key: "white", text: "White", color: "white" },
];

export const LineSizes = [
  { value: "thin", text: "Thin", key: "thin" },
  { value: "thick", text: "Thick", key: "thick" },
  { value: "ultra thick", text: "Ultra Thick", key: "ultra-thick" },
  { value: "help lines", text: "Help Line", key: "help-lines" },
];

export const TextPositions = [
  { value: "", text: "on top", key: "on-top" },
  { value: "below", text: "below", key: "below" },
  { value: "above", text: "above", key: "above" },
  { value: "right", text: "right", key: "right" },
  { value: "left", text: "left", key: "left" },
  { value: "below right", text: "below right", key: "below right" },
  { value: "below left", text: "below left", key: "below left" },
  { value: "above right", text: "above right", key: "above right" },
  { value: "above left", text: "above left", key: "above left" },
];

export const TextAlign = [
  { value: "left", text: "left", key: "left" },
  { value: "center", text: "center", key: "center" },
  { value: "right", text: "right", key: "right" },
];

export const Shapes = [
  { value: "none", text: "None", key: "none" },
  { value: "circle", text: "Circle", key: "circle" },
  // { value: "rectangle", text: "Rectangle", key: "rectangle" },
];
export function TextNode(
  label,
  position = "below",
  shape = "circle",
  radius = ".2pt"
) {
  this.textPosition = "below";
  this.textAlign = "center";
  this.color = "black";
  this.shape = shape;
  this.fill = "black";
  this.radius = radius;
  this.text = label;
  this.renderAsLatex = true;
}

TextNode.prototype.latexRepresentation = function (point) {
  let text = this.renderAsLatex ? `$${this.text}$` : this.text;
  let nodeCommand =
    !this.text || this.text.length <= 0
      ? ""
      : `\\node [${propText("align", this.textAlign, true)}${propText(
          "color",
          this.color
        )}${propText(
          undefined,
          this.textPosition
        )}] at ${point.latexRepresentation()} {${text}};\n`;
  let shapeCommand =
    this.shape != "none"
      ? `\\draw[fill=${this.fill}, color=${
          this.fill
        }] ${point.latexRepresentation()} ${this.shape} [radius=${
          this.radius
        }];\n`
      : "";
  return `${nodeCommand}${shapeCommand}`;
};
export function Command(type) {
  switch (type) {
    case "draw":
      this.type = "draw";
      this.color = "black";
      this.thickness = 0.1;
      this.style = "line";
      this.fill = undefined;
      this.decorator = undefined;
      this.segments = [];
      break;
    default:
      this.type = "raw";
      this.rawCommand = type;
  }
}

const propText = (name, value, first = false) => {
  const separator = first ? "" : ",";
  if (value && (!name || name.length <= 0)) {
    return `${separator}${value}`;
  }
  if (value) {
    return `${separator}${name}=${value}`;
  }
  return "";
};

Command.prototype.latexRepresentation = function () {
  if (this.type == "raw") {
    return this.rawCommand;
  }
  return `\\${this.type} [${propText("color", this.color, true)}${
    isNaN(this.thickness)
      ? propText(undefined, this.thickness)
      : propText("line width", this.thickness)
  }${propText(undefined, this.style)}${propText(this.decorator)}${propText(
    "fill",
    this.fill
  )}] ${this.segments.map((a) => a.latexRepresentation()).join(" -- ")};`;
};

Command.prototype.extraCommandRepresentation = function () {
  return !this.segments
    ? ""
    : this.segments.map((a) => a.extraCommandRepresentation()).join("");
};

export function Figure(name) {
  this.name = name;
  this.xScale = 1;
  this.yScale = 1;
  this.commands = [];
}

Figure.prototype.latexRepresentation = function (fullRenderer = false) {
  let representation = this.commands
    .map((a) => a.latexRepresentation())
    .join("\n");
  let extraRepresentation = this.extraCommandRepresentation();
  representation = `
    
    \\begin{tikzpicture}[xscale=${this.xScale},yscale=${this.yScale}]
    ${representation}
    ${extraRepresentation}
    \\end{tikzpicture}
  `;

  if (!fullRenderer) {
    return representation;
  }
  return `
  ${prefix}\
  ${representation}
  ${suffix}\
  `;
};

Figure.prototype.extraCommandRepresentation = function () {
  return this.commands.map((a) => a.extraCommandRepresentation()).join("");
};
export function Point(x, y) {
  this.x = x;
  this.y = y;
  this.node = new TextNode("", "below", "none");
}

Point.prototype.latexRepresentation = function () {
  return `(${this.x},${this.y})`;
};

Point.prototype.extraCommandRepresentation = function () {
  return this.node ? this.node.latexRepresentation(this) : "";
};

export function Segment(curved = false) {
  this.curved = curved;
  this.points = [];
}

Segment.prototype.latexRepresentation = function () {
  if (this.curved) {
    if (this.points.length < 3) {
      return "";
    }
    let first = this.points[0];
    let last = this.points[this.points.length - 1];
    let controls = this.points.slice(1, this.points.length - 1);
    return `${first.latexRepresentation()} .. controls ${controls
      .map((a) => a.latexRepresentation())
      .join(" and ")} .. ${last.latexRepresentation()}`;
  }
  return this.points.map((a) => a.latexRepresentation()).join(" -- ");
};

Segment.prototype.extraCommandRepresentation = function () {
  return this.points.map((a) => a.extraCommandRepresentation()).join("");
};
