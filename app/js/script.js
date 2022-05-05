const radius = window.innerWidth / 4;
const width = window.innerWidth;
const height = window.innerHeight;
const margin = ({ top: 20, right: 20, bottom: 30, left: 30 })

function drag(simulation) {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}


function tracksByAlbum() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const tracks = trackData.items.map((track) => {
        return ({
            type: "track",
            name: track.name,
            id: track.id,
            album: track.album,
            simplify: () => {
                return {
                    type: "track",
                    name: track.name,
                    id: track.id,
                }
            },
        })
    });
    const links = tracks.reduce((acc, curr) => {

        acc.push({
            source: curr.id,
            target: curr.album.id,
        })

        return acc;
    }, [])

    const albums = tracks.reduce((acc, curr) => {

        var idx = acc.findIndex(x => x.id === curr.album.id);

        if (idx === -1) {
            acc.push({
                type: "album",
                name: curr.album.name,
                id: curr.album.id,
            });
        }
        return acc;
    }, [])

    const nodes = (() => {
        let tees = tracks.map(tee => tee.simplify());

        return tees.concat(albums);

    })();

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-150))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("center", d3.forceCenter(width / 2, height / 2));


    d3.select("svg").remove();
    const svg = d3.select("#display")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .style("font", "12px sans-serif");

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", d => "#555");

    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(drag(simulation));

    node.append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("r", 10)
        .attr("fill", color)

    node.append("text")
        .attr("x", 20)
        .attr("y", "0.31em")
        .text(d => d.name)
        .clone(true).lower()
        .attr("fill", "none")
        .attr("font-size", "10px")
        .attr("stroke", "white")
        .attr("stroke-width", 3);

    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

}
function tracksByArtist() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const tracks = trackData.items.map((track) => {
        return ({
            type: "track",
            name: track.name,
            id: track.id,
            artists: track.artists.map((artist) => {
                return ({
                    name: artist.name,
                    id: artist.id,
                })
            }),
            simplify: () => {
                return {
                    type: "track",
                    name: track.name,
                    id: track.id,
                }
            },
        })
    });
    const links = tracks.reduce((acc, curr) => {

        curr.artists.forEach(element => {
            acc.push({
                source: curr.id,
                target: element.id,
            })
        });

        return acc;
    }, [])

    const artists = tracks.reduce((acc, curr) => {
        curr.artists.forEach(element => {
            var idx = acc.findIndex(x => x.id === element.id);
            if (idx === -1) {
                acc.push({
                    type: "artist",
                    name: element.name,
                    id: element.id,
                });
            }
        })
        return acc;
    }, [])

    const nodes = (() => {
        let tees = tracks.map(tee => tee.simplify());

        return tees.concat(artists);

    })();

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-150))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("center", d3.forceCenter(width / 2, height / 2));


    d3.select("svg").remove();
    const svg = d3.select("#display")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .style("font", "12px sans-serif");

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", d => "#555");

    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(drag(simulation));

    node.append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("r", 10)
        .attr("fill", color)

    node.append("text")
        .attr("x", 20)
        .attr("y", "0.31em")
        .text(d => d.name)
        .clone(true).lower()
        .attr("fill", "none")
        .attr("font-size", "10px")
        .attr("stroke", "white")
        .attr("stroke-width", 3);

    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

}

function tracksBalls() {

    const nodes = streamingByTrack;
    /*const nodes = [
        {
            artistName : "yee2",
            msPlayed : 654231,
        },
        {
            artistName : "yee5",
            msPlayed : 654231,
        },
        {
            artistName : "yee54",
            msPlayed : 654231,
        },
        {
            artistName : "yee4",
            msPlayed : 654231,
        }
    ];*/

    const simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-25))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(node => node.msPlayed / 1000 / 60 + 1))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    d3.select("svg").remove();

    const svg = d3.select("#display")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .style("font", "12px sans-serif");

    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(drag(simulation))

    node.append("circle")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("r", d => d.msPlayed / 1000 / 60)
        .attr("fill", "#777")

    node.append("text")
        .attr("x", 100)
        .attr("y", 100)
        .text(d => d.trackName)
        .clone(true).lower()
        .attr("fill", "none")
        .attr("font-size", "10px")
        .attr("stroke", "white")
        .attr("stroke-width", 3);

    simulation.on("tick", e => {
        svg.selectAll("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
}

function artistsByGenre() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const artists = artistData.items.map((artist) => {
        return ({
            type: "artist",
            name: artist.name,
            id: artist.id,
            genres: artist.genres.map((genre) => {
                return ({
                    id: genre,
                })
            }),
            image: artist.images[0].url,
            simplify: () => {
                return {
                    popularity: artist.popularity,
                    type: "artist",
                    name: artist.name,
                    id: artist.id,
                    image: artist.images.url,
                }
            },
        })
    });

    const links = artists.reduce((acc, curr) => {

        curr.genres.forEach(element => {
            acc.push({
                source: curr.id,
                target: element.id,
            })
        });

        return acc;
    }, [])

    const genres = artists.reduce((acc, curr) => {
        curr.genres.forEach(element => {
            var idx = acc.findIndex(x => x.id === element.id);
            if (idx === -1) {
                acc.push({
                    type: "genre",
                    id: element.id,
                    name: element.id,
                });
            }
        })
        return acc;
    }, [])
    console.log("artists : ", artists);
    console.log("genres : ", genres);
    console.log("links : ", links);

    const nodes = (() => {
        let tees = artists.map(tee => tee.simplify());

        return tees.concat(genres);

    })();

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-150))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("center", d3.forceCenter(width / 2, height / 2));


    d3.select("svg").remove();
    const svg = d3.select("#display")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .style("font", "12px sans-serif");

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", d => "#555");

    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(drag(simulation));

    node.append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("r", d => {
            if (d.popularity != undefined)
                return d.popularity / 10;
            return 5;
        })
        .attr("fill", color)

    node.append("text")
        .attr("x", 20)
        .attr("y", "0.31em")
        .text(d => d.name)
        .clone(true).lower()
        .attr("fill", "none")
        .attr("font-size", "10px")
        .attr("stroke", "white")
        .attr("stroke-width", 3);

    node.append("image")
        .attr("x", -40)
        .attr("y", -40)
        .attr("alt", "artistImg")
        .attr("height", d => d.popularity)
        .attr("width", d => d.popularity)
        .attr("xlink:href", d => d.image);


    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

}

function streamingTime() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const root = partition({ name: "Total", children: streamingHirarchy });

    d3.select("svg").remove();
    const svg = d3.select("#display")
        .append("svg");
    const element = svg.node();
    element.value = { sequence: [], percentage: 0.0 }

    const label = svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("fill", "#888")
        .style("visibility", "hidden");

    label.append("tspan")
        .attr("class", "percentage")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "-0.1em")
        .attr("font-size", "3em")
        .text("");

    label.append("tspan")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "1.5em")
        .text("d'écoute");

    svg.attr("viewBox", `${-radius * 2} ${-radius} ${width} ${width}`)
        .style("max-width", `${width}px`)
        .style("font", "12px sans-serif");

    const path = svg
        .append("g")
        .selectAll("path")
        .data(
            root.descendants()
        )
        .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc);

    svg
        .append("g")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mouseleave", () => {
            path.attr("fill-opacity", 1);
            label.style("visibility", "hidden");
            // Update the value of this view
            element.value = { sequence: [], percentage: 0.0 };
            element.dispatchEvent(new CustomEvent("input"));
        })
        .selectAll("path")
        .data(
            root.descendants()
        )
        .join("path")
        .attr("d", mousearc)
        .on("mouseenter", (event, d) => {
            // Get the ancestors of the current segment, minus the root
            const sequence = d
                .ancestors()
                .reverse()
                .slice(1);
            // Highlight the ancestors
            path.attr("fill-opacity", node =>
                sequence.indexOf(node) >= 0 ? 1.0 : 0.3
            );
            const name = d.data.name;
            const percentage = secondsToHms(d.value / 1000);
            label
                .style("visibility", null)
                .select(".percentage")
                .text(name + " : " + percentage);
            // Update the value of this view with the currently hovered sequence and percentage
            element.value = { sequence, percentage };
            element.dispatchEvent(new CustomEvent("input"));
        });

}

function musicThroughTime() {

    const entryData = streamingByDate;

    d3.select("svg").remove();
    const chartContainer = d3.select("#display");

    const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];

    const zoom = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent(extent)
        .extent(extent)
        .on('zoom', (event) => {
            x.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)));
            path.attr('transform', 'translate(' + event.transform.x + ',' + '0) scale(' + event.transform.k + ',1)');
            path.attr("stroke-width", 2 / event.transform.k)

            chart.selectAll(".x-axis").call(xAxis);
        })


    // The Chart
    const chart = chartContainer.append("svg")
        .attr("viewBox", [0, 0, width, height])
        .call(zoom);


    const x = d3.scaleTime()
        .domain(d3.extent(entryData, function (d) { return d.date; }))
        .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
        .domain([0, d3.max(entryData, d => d.value)])
        .range([height - margin.bottom, margin.top]);

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(entryData.y))

    const xAxis = g => g
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    const line = d3.line()
        .defined(d => !isNaN(d.value))
        .x(d => x(d.date))
        .y(d => y(d.value))


    const gx = chart.append("g")
        .call(xAxis);

    const gy = chart.append("g")
        .call(yAxis);

    const path = chart.append("path")
        .datum(entryData)
        .attr("class", "x-chart")
        .attr("fill", "#777")
        .attr("stroke-width", 1.5)
        .attr("stroke", "#111")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)
}

function linkArc(d) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
      M${d.source.x},${d.source.y}
      A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
}

const types = ["track", "artist", "genre"];
var color = (d) => {
    var result = d.type === "track" ? "#49a9bf" :
        d.type === "artist" ? "#ff0009" : "#ff9b00";
    return result;
}

function partition(data) {
    return d3.partition().size([2 * Math.PI, radius * radius])(
        d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value)
    )
}

var arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(1 / radius)
    .padRadius(radius)
    .innerRadius(d => Math.sqrt(d.y0))
    .outerRadius(d => Math.sqrt(d.y1) - 1);

var mousearc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .innerRadius(d => Math.sqrt(d.y0))
    .outerRadius(radius);

function breadcrumbPoints(d, i) {
    const tipWidth = 10;
    const points = [];
    points.push("0,0");
    points.push(`${breadcrumbWidth},0`);
    points.push(`${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`);
    points.push(`${breadcrumbWidth},${breadcrumbHeight}`);
    points.push(`0,${breadcrumbHeight}`);
    if (i > 0) {
        // Leftmost breadcrumb; don't include 6th vertex.
        points.push(`${tipWidth},${breadcrumbHeight / 2}`);
    }
    return points.join(" ");
}

function secondsToHms(d) {
    d = Number(d);
    var j = Math.floor(d / 86400);
    var h = Math.floor(d % 86400 / 3600);
    var m = Math.floor(d % 86400 % 3600 / 60);
    var s = Math.floor(d % 86400 % 3600 % 60);

    var jDisplay = j > 0 ? j + (j == 1 ? " jour, " : " jours, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " heure, " : " heures, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " seconde" : " secondes") : "";
    return jDisplay + hDisplay + mDisplay + sDisplay;
}
