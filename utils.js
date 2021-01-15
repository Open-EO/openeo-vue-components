import { Utils as CommonUtils } from '@openeo/js-commons';

class Utils extends CommonUtils {

    static enableHtmlProps(vue) {
        if (Utils.isObject(vue) && Utils.isObject(vue.props)) {
            for(let key in vue.props) {
                if (!Utils.isObject(vue.props[key])) {
                    vue.props[key] = {
                        type: vue.props[key],
                        default: undefined
                    }
                }
                if (vue.props[key].type === Function) {
                    continue;
                }
                let defaultValue = vue.props[key].default;
                if (typeof defaultValue === 'function') {
                    defaultValue = defaultValue();
                }
                vue.props[key].default = function() {
                    return Utils.readHtmlProp(key, this, defaultValue);
                };
            }
        }
        return vue;
    }

    static readHtmlProp(prop, component, defaultValue = undefined) {
        if (Utils.isObject(component) && Utils.isObject(component.$slots) && Array.isArray(component.$slots.default)) {
            let el = component.$slots.default.find(slot => typeof slot.tag === 'string' && slot.tag.toUpperCase() === 'SCRIPT' && slot.data.attrs.prop === prop && slot.data.attrs.type === 'application/json');
            if (el) {
                try {
                    return JSON.parse(el.data.domProps.innerHTML);
                }
                catch (error) {
                    console.error(`Data passed to prop '${prop}' via script tag is invalid: ${error.message}`);
                }
            }
        }
        return defaultValue;
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
        if (typeof str === 'string') {
            return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
        }
        else {
            return str;
        }
    }

    static htmlentities(str) {
        if (typeof str === 'string') {
            return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, '&apos;');
        }
        else {
            return str;
        }
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