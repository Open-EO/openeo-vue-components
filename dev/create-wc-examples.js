const fs = require('fs');
const examples = require('./examples');

const FOLDER = './examples';

if (!fs.existsSync(FOLDER)){
    fs.mkdirSync(FOLDER);
}

for(let component in examples) {
	for(let id in examples[component]) {
		createExampleFile(component, id, examples[component][id]);
	}
}

function createExampleFile(component, id, props) {
	let jsonProps = [];
	let otherProps = [];
	for(let prop in props) {
		let value = props[prop];
		if (value && typeof value === 'object') {
			let json = JSON.stringify(value);
			jsonProps.push(`
				<script prop="${prop}" type="application/json">${json}</script>
			`);
		}
		else {
			otherProps.push(`${prop}="${value}"`);
		}
	}

	let attributes = '';
	if (otherProps.length) {
		attributes = ` ${otherProps.join(' ')}`;
	}

	let html = `
	<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<title>openEO ${component}</title>
			<link href="../dev/examples.css" rel="stylesheet"></script>
			<script src="../assets/openeo.js"></script>
		</head>
		<body>
			<openeo-${component}${attributes}>${jsonProps.join("\r\n")}</openeo-${component}>
		</body>
	</html>
	`;
	fs.writeFileSync(`${FOLDER}/${component}-${id}.html`, html);
}
