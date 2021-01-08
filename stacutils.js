import Utils from './utils';

const StacFields = {
	"version": {
		label: "Collection Version"
	},
	"deprecated": {
		label: "Deprecated"
	},
	"datetime": {
		label: "Dates",
		format: "Timestamp"
	},
	"start_datetime": {
		label: "Start dates",
		format: "Timestamp"
	},
	"end_datetime": {
		label: "End dates",
		format: "Timestamp"
	},
	"platform": {
		label: "Platform"
	},
	"constellation": {
		label: "Constellation"
	},
	"instruments": {
		label: "Instrument / Sensor"
	},
	"mission": {
		label: "Mission"
	},
	"sat:orbit_state": {
		label: "Orbit state"
	},
	"sat:relative_orbit": {
		label: "Relative orbit numbers"
	},
	"eo:gsd": {
		label: "Ground sample distance",
		suffix: "m"
	},
	"eo:bands": {
		label: "Spectral Bands",
		isTable: true
	},
	"eo:bands.gsd": {
		label: "GSD",
		suffix: "m"
	},
	"eo:bands.center_wavelength": {
		label: "Wavelength",
		suffix: "μm"
	},
	"eo:cloud_cover": {
		label: "Cloud cover",
		suffix: "%"
	},
	"proj:epsg": {
		label: "EPSG code"
	},
	"view:off_nadir": {
		label: "Off-nadir angle",
		suffix: "º"
	},
	"view:azimuth": {
		label: "Sun azimuth",
		suffix: "º"
	},
	"view:sun_azimuth": {
		label: "Sun azimuth",
		suffix: "º"
	},
	"view:sun_elevation": {
		label: "Sun elevation",
		suffix: "º"
	},
	"view:incidence_angle": {
		label: "Incidence angle",
		suffix: "º"
	},
	"sar:instrument_mode": {
		label: "Instrument mode"
	},
	"sar:frequency_band": {
		label: "Frequency band name"
	},
	"sar:center_frequency": {
		label: "Center frequency",
		suffix: "GHz"
	},
	"sar:polarization": {
		label: "Polarizations"
	},
	"sar:product_type": {
		label: "Product type"
	},
	"sar:bands": {
		label: "SAR Bands",
		isTable: true
	},
	"sar:pass_direction": {
		label: "Direction of the orbit"
	},
	"sar:type": {
		label: "Product type"
	},
	"sar:resolution_range": {
		label: "Range Resolution",
		suffix: "m"
	},
	"sar:resolution_azimuth": {
		label: "Azimuth Resolution",
		suffix: "m"
	},
	"sar:pixel_spacing_range": {
		label: "Range pixel spacing",
		suffix: "m"
	},
	"sar:pixel_spacing_azimuth": {
		label: "Azimuth pixel spacing",
		suffix: "m"
	},
	"sar:looks_range": {
		label: "Number of range looks"
	},
	"sar:looks_azimuth": {
		label: "Number of azimuth looks"
	},
	"sar:looks_equivalent_number": {
		label: "Equivalent number of looks (ENL):"
	},
	"sar:observation_direction": {
		label: "Antenna pointing direction"
	},
	"sci:doi": {
		label: "DOI",
		isDOI: true
	},
	"sci:citation": {
		label: "Recommended citation",
		format: "commonmark"
	},
	"sci:publications": {
		label: "Related publications"
	},
	"sci:publications.citation": {
		label: "Publication",
		format: "commonmark"
	},
	"sci:publications.doi": {
		label: "DOI",
		isDOI: true
	},
	"cube:dimensions.extent": {
		label: "Extent",
		format: "Extent"
	},
	"gee:schema": {
		label: "Variables"
	},
	"gee:terms_of_use": {
		label: "Terms of Use",
		format: "commonmark"
	}
};

const StacCollectionUtils = {
	FIELDS: StacFields,
	restructure(val, key, parentField = null) {
		let meta = {};
		var fieldName = parentField ? parentField + "." + key : key;
		if (this.isObject(StacFields[fieldName])) {
			meta = StacFields[fieldName];
		}

		// If top-level element of summary, remove for arrays with single element the outer array structure
		if (parentField === null && Array.isArray(val) && val.length === 1 && meta.isTable !== true) {
			val = val[0];
		}

		// Go into values of object
		if (parentField === null && Array.isArray(val)) {
			for(let i in val) {
				if (this.isObject(val[i])) {
					for(let key2 in val[i]) {
						val[i][key2] = this.restructure(val[i][key2], key2, key);
					}
				}
			}
		}
		else if (parentField === null && this.isObject(val)) {
			for(let key2 in val) {
				val[key2] = this.restructure(val[key2], key2, key);
			}
		}

		if (meta.isDOI) {
			val = {
				href: 'http://doi.org/' + val,
				title: val
			}
		}
		// meta.isTable can be: 
		// true: force table, false: never a table, undefined: detect table by value
		else if (meta.isTable !== false) {
			let tableHeaders = this.tableHeader(val, meta.isTable === true);
			if (tableHeaders.length > 0) {
				val = {
					isTable: true,
					isWide: tableHeaders.length >= 2,
					header: tableHeaders,
					data: val
				};
			}
		}

		return val;
	},
	formatExtent(extent, key = null) {
		var v1 = key === null ? extent[0] : this.formatValue(extent[0], key);
		var v2 = key === null ? extent[1] : this.formatValue(extent[1], key);
		if (v1 === null) {
			return "Until " + v2;
		}
		else if (v2 === null) {
			return "From " + v1;
		}
		else {
			return v1 + ' to ' + v2;
		}
	},
	formatValues(values, key) {
		return this.formatCommaValues(values.map(v => this.formatValue(v, key)));
	},
	formatCommaValues(values) {
		return values.join(', ');
	},
	formatTemporalExtent(extent) {
		if (!Array.isArray(extent) || extent.length < 2 || (!extent[0] && !extent[1])) {
			return "N/A";
		}
		else if (!extent[0]) {
			return "Until " + this.formatTimestamp(extent[1]);
		}
		else if (!extent[1]) {
			return this.formatTimestamp(extent[0]) + " until present";
		}
		else if (extent[0] == extent[1]) {
			return this.formatTimestamp(extent[0]);
		}
		else {
			return this.formatTimestamp(extent[0]) + ' – ' + this.formatTimestamp(extent[1]);
		}
	},
	formatTimestamp(datetime) {
		if (typeof datetime === 'string') {
			return datetime.replace('T', ' ').replace('Z', ' UTC');
		}
		else {
			return "N/A";
		}
	},
	formatKey(key, parentField = null) {
		var fieldName = parentField ? parentField + "." + key : key;
		if (this.isObject(StacFields[fieldName])) {
			return StacFields[fieldName].label;
		}
		else if (key.indexOf(':') !== -1) {
			key = key.substr(key.indexOf(':')+1);
		}
		return Utils.prettifyString(key);
	},
	formatValue(value, key, parentField = null) {
		if (typeof value === 'undefined') {
			return 'N/A';
		}

		if (this.isObject(value) && typeof value.min !== 'undefined' && typeof value.max !== 'undefined') {
			return this.formatExtent([value.min, value.max], key);
		}

		var fieldName = parentField ? parentField + "." + key : key;
		if (this.isObject(StacFields[fieldName])) {
			var info = StacFields[fieldName];

			if (typeof info.format === 'function') {
				return info.format(value, key);
			}
			else if (typeof this['format' + info.format] === 'function') {
				return this['format' + info.format](value);
			}

			var isScalarArray = false;
			if (Array.isArray(value)) {
				isScalarArray = true;
				for(var i in value) {
					if (typeof value[i] === 'object') {
						isScalarArray = false;
						break;
					}
				}
				if (isScalarArray) {
					for(var i in value) {
						value[i] = this.formatValue(value[i]);
					}
				}
			}

			if (value === 'null') {
				return "None";
			}
			else if (value === true) {
				return '✔️';
			}
			else if (value === false) {
				return '❌';
			}

			if (info.suffix && (typeof value === 'string' || typeof value === 'number')) {
				return value + ' ' + info.suffix;
			}

			if (isScalarArray) {
				return '[ ' + value.join(', ') + ' ]';
			}
		}
		return value;
	},
	isObject(value) {
		return Utils.isObject(value);
	},
	isLink(value) {
		return this.isObject(value) && value.href && value.title;
	},
	isDescription(key, parentField = null) {
		if (key.includes('description')) {
			return true;
		}

		var fieldName = parentField ? parentField + "." + key : key;
		if (this.isObject(StacFields[fieldName])) {
			return StacFields[fieldName].format === 'commonmark';
		}
		else {
			return false;
		}
	},
	isTable(value) {
		return this.isObject(value) && value.isTable;
	},
	tableHeader(value, force = false) {
		return Utils.isTableLike(value, force);
	}
};

export default StacCollectionUtils;