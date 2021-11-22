import { Utils as CommonUtils, ProcessSchema } from '@openeo/js-commons';
import Loading from './components/internal/Loading.vue';
import Errored from './components/internal/Errored.vue';

class Utils extends CommonUtils {

    static kebabToCamelCase(str) {
        return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '');
    }

    static enableHtmlProps(vm) {
        // Don't execute if not in web-component mode (i.e. check for the shadow root)
        if (!Utils.isObject(vm.$root) || !vm.$root.$options.shadowRoot) {
            return;
        }

        // Read the HTML props once the page is completely loaded and all props are completely available
        if(document.readyState === 'complete') {
            Utils.readHtmlProps(vm);
        }
        else {
            document.addEventListener('readystatechange', () => Utils.enableHtmlProps(vm), {once: true});
        }
    }

    static readHtmlProps(vm) {
        if (!Utils.isObject(vm) || !Utils.isObject(vm.$slots) || !Array.isArray(vm.$slots.default)) {
            return;
        }

        // Read script tags
        let slots = vm.$slots.default.filter(slot => typeof slot.tag === 'string' && slot.tag.toUpperCase() === 'SCRIPT' && typeof slot.data.attrs.type === 'string' && slot.data.attrs.type.includes('application/json'));
        // We are using `includes` here as for some strange reasons in Jupyter Notebooks subsequent re-renders of the cell
        // result in the attribute value being prefixed by a "true/", i.e.the value in slot.data.attrs.type is "true/application/json".
        for(let slot of slots) {
            let prop = null;
            try {
                if (typeof slot.data.attrs.prop === 'string' && slot.data.attrs.prop.length > 0) {
                    prop = Utils.kebabToCamelCase(slot.data.attrs.prop);
                }
                let value = JSON.parse(slot.data.domProps.innerHTML);
                if (prop) {
                    Utils.setProp(vm, prop, value); // Set a single prop
                }
                else if (Utils.isObject(value)) {
                    for(let key in value) { // Set all props
                        Utils.setProp(vm, key, value[key]);
                    }
                }
                else {
                    console.error(`Props passed via script tag must be contained in an object.`);
                }
            }
            catch (error) {
                if (prop) {
                    console.error(`Prop '${prop}' passed via script tag is invalid: ${error.message}`);
                }
                else {
                    console.error(`Props passed via script tag are invalid: ${error.message}`);
                }
            }
        }
    }

    static loadFontAwesome(vm) {
        let webComponent = Utils.isObject(vm.$root) && vm.$root.$options.shadowRoot;

        let stylesheets = Array.from((webComponent || document).styleSheets);
        for(let css of stylesheets) {
            if (typeof css.href === 'string' && css.href.includes('fontawesome')) {
                return;
            }
        }

        // Don't execute if not in web-component mode (browsers don't support loading fonts in shadowroot)
        if (!webComponent) {
            let font = document.createElement('link');
            font.as = "font";
            font.type = "font/woff2";
            font.crossOrigin = true;
            font.href = "https://use.fontawesome.com/releases/v5.13.0/webfonts/fa-solid-900.woff2";
            document.head.appendChild(font);
        }

        let css = document.createElement('link');
        css.rel = "stylesheet";
        css.type = "text/css";
        css.media = "all";
        css.href = "https://use.fontawesome.com/releases/v5.13.0/css/all.css";
        (webComponent || document.head).appendChild(css);
    }

    static setProp(vm, prop, value) {
        // Depending on when during the page load this is executed, we
        // need either to populate propsData (initially available) or
        // $props (available after propsData has been read).
        let propsRef = Utils.isObject(vm.$props) ? vm.$props : vm.$options.propsData;
        vm.$set(propsRef, Utils.kebabToCamelCase(prop), value);
    }

    static loadAsyncComponent(importer) {
        return {
            component: importer,
            loading: Loading,
            error: Errored,
            delay: 0,
            timeout: 10000
        };
    }

    static dataType(schema, signature = false, similarAllowed = 2, level = 0) {
        let schemaObj = new ProcessSchema(schema);
        var types = new Set();
        for(let i in schemaObj.schemas) {
            let dt = schemaObj.schemas[i];
            let native = dt.nativeDataType();
            let type = dt.dataType();
            // Make the data types that we can submit via JSON (e.g. raster-cube, labeled-array) native
            if (!dt.isEditable()) {
                native = type;
            }
            else if (signature && schemaObj.schemas.filter(other => other.nativeDataType() === native).length > similarAllowed) {
                // For signatures only: Check whether another similar type is available, then show only native type
                types.add(native);
                continue;
            }
            let formatted = native === type ? type : `${type}:${native}`;
            if (native === 'array' && Utils.isObject(dt.schema.items)) {
                let arrayItems = Utils.dataType(dt.schema.items, signature, similarAllowed, level + 1);
                if (arrayItems !== 'any') {
                    formatted += `<${arrayItems}>`;
                }
            }
            types.add(formatted);
        }
        if (types.has('any')) {
            return 'any';
        }
        return Array.from(types).join(signature || level > 0 ? '|' : ', ');
    }

    static htmlentities_decode(str) {
        if (typeof str !== 'string') {
            str = String(str);
        }
        return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
    }

    static htmlentities(str) {
        if (typeof str !== 'string') {
            str = String(str);
        }
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, '&apos;');
    }
    
    static countObjectKeys(data) {
        var count = {};
        for(var i in data) {
            var obj = data[i];
            if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
                return null;
            }
            for(var key in obj) {
                if (typeof count[key] === 'undefined') {
                    count[key] = 1;
                }
                else {
                    count[key]++;
                }
            }
        }
        return count;
    }

    static isTableLike(data, force = false) {
        if (typeof data !== 'object' || data === null) {
            return [];
        }

        var countedKeys = Utils.countObjectKeys(data);
        if (countedKeys !== null) {
            if (force === true) {
                return Object.keys(countedKeys);
            }
            var num = 0;
            var sum = 0;
            for (var i in countedKeys) {
                num++;
                sum += countedKeys[i];
            }

            var avg = sum / num;
            var dataSize = Array.isArray(dataSize) ? data.length : Object.keys(data).length;
            if (avg > dataSize/2) {
                return Object.keys(countedKeys);
            }
        }

        return [];
    }

    static prettifyAbbreviation(str) {
        if (typeof str === 'string' && str.match(/[A-Z]+/) === null) {
            return str.toUpperCase();
        }
        return str;
    }

	static domBoundingBox(el) {
		var rect = el.getBoundingClientRect();
		rect.offsetTop = rect.top + Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		rect.offsetLeft = rect.left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		return rect;
    }
    
	static ensurePoint(pt, fallback = null) {
		if (typeof fallback !== 'function') {
			fallback = () => [0,0];
		}
		if (!Array.isArray(pt)) {
			return fallback();
		}
		if (typeof pt[0] !== 'number') {
			pt[0] = fallback()[0] || 0;
		}
		if (typeof pt[1] !== 'number') {
			pt[1] = fallback()[1] || 0;
		}
		return pt;
    }
    
	static formatRef(value) {
		if (this.isRef(value)) {
			if (value.from_node) {
				return "#" + value.from_node;
			}
			else if (value.from_parameter) {
				return "$" + value.from_parameter;
			}
		}
		return value;
	}

	static isRef(obj) {
		return (Utils.isObject(obj) && (obj.from_parameter || obj.from_node));
	}

	static isRefEqual(ref1, ref2) {
		if (!Utils.isRef(ref1) || !Utils.isRef(ref2)) {
			return false;
		}
		else if (ref1.from_parameter && ref1.from_parameter === ref2.from_parameter) {
			return true;
		}
		else if (ref1.from_node && ref1.from_node === ref2.from_node) {
			return true;
		}
		return false;
	}

	// A very rough GeoJSON detection, if no GeoJSON schema is available.
	static detectGeoJson(data) {
		if (!Utils.isObject(data)) {
			return false;
		}
		else if (typeof data.type !== 'string') {
			return false;
		}

		switch(data.type) {
			case "Point":
			case "MultiPoint":
			case "LineString":
			case "MultiLineString":
			case "Polygon":
			case "MultiPolygon":
				if (!Array.isArray(data.coordinates)) {
					return false;
				}
				return true;
			case "GeometryCollection":
				if (!Array.isArray(data.geometries)) {
					return false;
				}
				return true;
			case "Feature":
				if (data.geometry !== null && !Utils.isObject(data.geometry)) {
					return false;
				}
				if (data.properties !== null && !Utils.isObject(data.properties)) {
					return false;
				}
				return true;
			case "FeatureCollection":
				if (!Array.isArray(data.features)) {
					return false;
				}
				return true;
			default:
				return false;
		}
    }
    
    static toProcessParameters(parameters) {
        if (Utils.isObject(parameters)) {
            let processParameters = [];
            for(let name in parameters) {
                let param = parameters[name];
                let schema = Utils.omitFromObject(param, ['description', 'required', 'default']);
                processParameters.push({
                    name,
                    description: param.description,
                    optional: !param.required,
                    default: param.default,
                    schema
                });
            }
            return processParameters.sort((a,b) => Utils.compareStringCaseInsensitive(a.name, b.name));
        }
        else {
            return [];
        }
    }
	
	static formatCurrency(amount, currency, fallback = '') {
		if (typeof amount !== 'number' || typeof currency !== 'string') {
			return fallback;
		}

		try {
			return amount.toLocaleString(undefined, { style: 'currency', currency: currency });
		} catch(error) {
			return `${amount.toLocaleString()} ${currency}`.trim();
		}
	}

    static formatBudget(budget, currency, unlimited = "Unlimited") {
        if (budget === null) {
			return unlimited;
        }
		else {
            return Utils.formatCurrency(budget, currency);
		}
    }

	static formatTimestamp(value, fallback = 'n/a') {
		if (typeof value === 'string') {
			try {
				return new Date(value).toLocaleString([], {
					timeZone: "UTC",
					timeZoneName: "short"
				});
			} catch (error) {}
		}
		return fallback;
	}

	static formatFileSize(value, fallback = 'n/a') {
	    let units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
		if (typeof value !== 'number') {
			return fallback;
		}
		let i = value == 0 ? 0 : Math.floor( Math.log(value) / Math.log(1024) );
        let size = ( value / Math.pow(1024, i) ).toFixed(2) * 1;
        return `${size} ${units[i]}`;
	}

    static formatProcessSignature(process, html = true) {
        let params = [];
        if (Array.isArray(process.parameters)) {
            for(let i in process.parameters) {
                let p = process.parameters[i];
                let pType = Utils.dataType(p.schema, true, 1);
                let req = p.optional ? '?' : '';
                let pDefault = '';
                if (p.optional && typeof p.default !== 'undefined') {
                    pDefault = JSON.stringify(p.default);
                }
                let pStr;
                if (html) {
                    pStr = `<span class="param-optional">${req}</span><span class="data-type">${ Utils.htmlentities(pType) }</span> <span class="param-name">${ Utils.htmlentities(p.name) }</span>`;
                    if (pDefault) {
                        if (pDefault.length > 30) {
                            pDefault = `<span title="${ Utils.htmlentities(pDefault) }">…</span>`;
                        }
                        pStr += ` = <span class="param-argument">${pDefault}</span>`;
                    }
                }
                else {
                    pStr = req + pType + " " + p.name + pDefault;
                }
                params.push(pStr);
            }
        }
        let paramStr = "(" + params.join(", ") + ") : ";

        let returnSchema = Utils.isObject(process.returns) && process.returns.schema && typeof process.returns.schema === 'object' ? process.returns.schema : {};
        let returns = Utils.dataType(returnSchema, true, 2);

        if (html) {
            return `<span class="process-name">${ Utils.htmlentities(process.process.id) }</span>${paramStr}<span class="data-type">${ Utils.htmlentities(returns) }</span>`;
        }
        else {
            return process.process.id + paramStr + returns;
        }
    }

};

export default Utils;