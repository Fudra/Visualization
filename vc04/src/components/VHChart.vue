<template>
  <div id="chart" />
</template>

<script>
/* eslint-disable  */
import * as d3 from "d3";

export default {
  name: "VHChart",
  data() {
    return {
      cwidth: 600,
      cheight: 600,
      scale: [-10, 10],
      svg: {},
      g: {},
      graph: {
        nodes: [],
        links: [],
        simulation: {},
        node: {},
        link: {},
        labels: {},
        transform: {}
      }
    };
  },
  props: {
    data: Object,
    search: {
      type: String,
      default: ""
    },
    showLables: {
      type: Boolean,
      default: true,
    }
  },
  computed: {},
  methods: {
    filterLabel(node) {
      if (!this.search.length) {
        return "fill-current text-blue-800";
      }

      return node.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0
        ? "fill-current text-green-800"
        : "fill-current text-gray-300";
    },
    filterNode(node) {
      if (!this.search.length) {
        return "fill-current text-gray-500";
      }

      return node.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0
        ? "fill-current text-green-200"
        : "fill-current text-gray-200";
    },
    initData(data) {
      this.graph.links = data.links.map(d => Object.create(d));
      this.graph.nodes = data.nodes.map(d => Object.create(d));
      this.graph.labels = data.nodes.map(d => Object.create(d));
    },
    initSvg() {
      this.svg = d3
        .select("#chart")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .classed("svg-content-responsive", true)
        .attr("viewBox", [0, 0, this.cwidth, this.cheight]);

      this.g = this.svg.append("g");
      this.graph.transform = d3.zoomIdentity;
    },
    zoomChart() {
      // https://observablehq.com/@d3/zoom

      this.svg.call(
        d3
          .zoom()
          .extent([
            [0, 0],
            [this.cwidth, this.cheight]
          ])
          .scaleExtent(this.scale)
          .on("zoom", () => {
            this.g.attr("transform", d3.event.transform);
          })
      );
    },
    forceSimulation() {
      const _this = this;

      this.graph.simulation = d3
        .forceSimulation(this.graph.nodes)
        .force(
          "link",
          d3.forceLink(this.graph.links).id(d => d.id)
        )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(this.cwidth / 2, this.cheight / 2))
        .on("tick", function() {
          // remove decay
          this.alphaDecay(0);

          _this.graph.link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

          _this.graph.node.attr("cx", d => d.x).attr("cy", d => d.y);

          _this.graph.labels.attr("x", d => d.x).attr("y", d => d.y);

          if(!_this.showLables) {
            _this.graph.labels.attr("style", "opacity: 0;");
          } else {
             _this.graph.labels.attr("style", "opacity: 1;");
          }

        });
    },
    dragGraph() {
      const _this = this;

      this.graph.node.call(
        d3
          .drag()
          //.container(canvas)
          .on("start", function() {
            d3.select(this).raise();
            _this.g.attr("cursor", "grabbing");
          })
          .on("drag", function(d) {
            d3.select(this)
              .attr("cx", (d.x = d3.event.x))
              .attr("cy", (d.y = d3.event.y));
          })
          .on("end", () => {
            _this.g.attr("cursor", "grab");
          })
      );
    },
    searchNode() {
      d3.timer(() => {
        this.graph.node.attr("class", d => this.filterNode(d));

        this.graph.labels.attr("class", d => this.filterLabel(d));
      });
    },
    createGraph(data) {
      this.initSvg();

      // create links
      this.graph.link = this.g
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(this.graph.links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.weight));

      // create nodes
      this.graph.node = this.g
        .append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .selectAll("circle")
        .data(this.graph.nodes)
        .join("circle")
        .attr("r", d => Math.sqrt(25 * d.score));

      // create text
      this.graph.labels = this.g
        .append("g")
        .selectAll("text")
        .data(this.graph.nodes)
        .join("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", d => `${16 * d.weight}px`)
        .attr("class", "fill-current")
        .text(d => d.name);

      this.forceSimulation();

      this.dragGraph();

      this.searchNode();

      this.zoomChart();
    }
  },
  watch: {
    data: {
      handler(value) {
        this.initData(value);
        this.createGraph(value);
      }
    }
  }
};
</script>

<style scoped>
.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* aspect ratio */
  vertical-align: top;
  overflow: hidden;
}
.svg-content-responsive {
  display: inline-block;
  position: absolute;
  top: 10px;
  left: 0;
}

svg .rect {
  fill: gold;
  stroke: steelblue;
  stroke-width: 5px;
}
</style>
