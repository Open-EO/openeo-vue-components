import { Utils as CommonUtils } from '@openeo/js-commons';
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
        if(document.readyState !== 'loading') {
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
        let slots = vm.$slots.default.filter(slot => typeof slot.tag === 'string' && slot.tag.toUpperCase() === 'SCRIPT' && slot.data.attrs.type === 'application/json');
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

    static dataType(schema, short = false, level = 0, type = undefined) {
        if (Utils.isAnyType(schema)) {
            type = 'any';
        }
        if (typeof type === 'undefined') {
            type = schema.type;
        }
        if (typeof schema === 'object' && (Array.isArray(schema) || typeof schema.oneOf !== 'undefined' || typeof schema.anyOf !== 'undefined')) {
            if (short) {
                return 'mixed';
            }
            var choice;
            if (Array.isArray(schema)) {
                choice = schema;
            }
            else {
                choice = schema.oneOf || schema.anyOf;
            }
            var types = [];
            for(let i in choice) {
                types.push(Utils.dataType(choice[i], short, level));
            }
            return types.join(', ');
        }
        else if (Array.isArray(type)) {
            var types = [];
            for(let i in type) {
                types.push(Utils.dataType(schema, short, level, type[i]));
            }
            return types.join(short ? '|' : ', ');
        }
        else if (typeof type === 'string' && type.toLowerCase() === 'array' && typeof schema.items === 'object' && typeof schema.items.type !== 'undefined') {
            var arrType = "array<"+Utils.dataType(schema.items, true, level+1)+">";
            if (typeof schema.subtype === 'string') {
                if (level == 0) {
                    return schema.subtype + (short ? ":" + arrType : " ("+arrType+")");
                }
                else {
                    return schema.subtype;
                }
            }
            else {
                return arrType;
            }
        }
        else if (typeof type === 'string' && typeof schema.subtype === 'string') {
            return schema.subtype + (short ? ":" + type : " ("+type+")");
        }
        return type;
    }

    static isAnyType(schema) {
		return (typeof schema !== 'object' || (!Array.isArray(schema) && typeof schema.type === 'undefined' && typeof schema.oneOf === 'undefined' && typeof schema.allOf === 'undefined' && typeof schema.anyOf === 'undefined'));
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
		rect.offsetTop = rect.top + document.body.scrollTop;
		rect.offsetLeft = rect.left + document.body.scrollLeft;
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


};

export default Utils;