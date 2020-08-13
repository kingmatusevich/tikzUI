let prefix = `
    \\documentclass[crop,tikz]{standalone}
    \\tikzstyle{line}=[draw]
    \\begin{document}
    \\begin{tikzpicture}
    `;

let suffix = `
    \\end{tikzpicture}
    \\end{document}
    `;

export function Command(type) {
  switch (type) {
    case "draw":
      this.type = "draw";
      this.color = "black";
      this.thickness = 0.1;
      this.style = "line";
      this.segments = [];
      break;
    default:
      this.type = "raw";
      this.rawCommand = type;
  }
}

Command.prototype.latexRepresentation = function () {
  if (this.type == "raw") {
    return this.rawCommand;
  }
  return `\\${this.type} [color=${this.color},line width=${this.thickness},${
    this.style
  }] ${this.segments.map((a) => a.latexRepresentation()).join(" -- ")};`;
};

export function Figure(name) {
  this.name = name;
  this.commands = [];
}

Figure.prototype.latexRepresentation = function (fullRenderer = false) {
  let representation = this.commands
    .map((a) => a.latexRepresentation())
    .join("\n");
  if (!fullRenderer) {
    return representation;
  }
  return `
  ${prefix}\
  ${representation}
  ${suffix}\
  `;
};

export function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.latexRepresentation = function () {
  return `(${this.x},${this.y})`;
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
