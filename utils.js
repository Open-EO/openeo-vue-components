import { Utils as CommonUtils } from '@openeo/js-commons';

class Utils {

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
            for(var i in choice) {
                types.push(Utils.dataType(choice[i], short, level));
            }
            return types.join(', ');
        }
        else if (Array.isArray(type)) {
            var types = [];
            for(var i in type) {
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

    static isTableLike(data) {
        if (typeof data !== 'object' || data === null) {
            return [];
        }

        var countedKeys = Utils.countObjectKeys(data);
        if (countedKeys !== null) {
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

    static compareStringCaseInsensitive(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    }

    static prettifyString(s) {
        if(CommonUtils.isNumeric(s)) {
            return s;
        }
        else {
            // Camelcase converter
            s = s.replace(/([a-z])([A-Z])/g, '$1 $2');
            // Kebab case converter
            s = s.replace(/([a-zA-Z\d])_([a-zA-Z\d])/g, '$1 $2');
            // Uppercase the first letter in the first word
            return s.charAt(0).toUpperCase() + s.substr(1);
        }
    }

    static friendlyLinks(linkList, sort = true, ignoreRel = ['self']) {
        let links = [];
        if (!Array.isArray(linkList)) {
            return links;
        }

        for(let link of linkList) {
            link = Object.assign({}, link); // Make sure to work on a copy
            if (typeof link.rel === 'string' && ignoreRel.includes(link.rel.toLowerCase())) {
                continue;
            }
            if (typeof link.title !== 'string' || link.title.length === 0) {
                if (typeof link.rel === 'string' && link.rel.length > 1) {
                    link.title = Utils.prettifyString(link.rel);
                }
                else {
                    link.title = link.href.replace(/^https?:\/\/(www.)?/i, '').replace(/\/$/i, '');
                }
            }
            links.push(link);
        }
        if (sort) {
            links.sort((a, b) => a.title.localeCompare(b.title));
        }
        return links;
    }

    static prettifyAbbreviation(s) {
        if (typeof s === 'string' && s.match(/[A-Z]+/) === null) {
            return s.toUpperCase();
        }
        return s;
    }

};

export default Utils;