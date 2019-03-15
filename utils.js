var Utils = {

    dataType: function(schema, short = false, level = 0, type = undefined) {
        if (this.isAnyType(schema)) {
            type = 'any';
        }
        if (typeof type === 'undefined') {
            type = schema.type;
        }
        if (typeof schema === 'object' && (typeof schema.oneOf !== 'undefined' || typeof schema.allOf !== 'undefined' || typeof schema.anyOf !== 'undefined')) {
            if (short) {
                return 'mixed';
            }
            var choice = schema.oneOf || schema.allOf || schema.anyOf;
            var types = [];
            for(var i in choice) {
                types.push(this.dataType(choice[i], short, level));
            }
            return types.join(', ');
        }
        else if (Array.isArray(type)) {
            var types = [];
            for(var i in type) {
                types.push(this.dataType(schema, short, level, type[i]));
            }
            return types.join(short ? '|' : ', ');
        }
        else if (typeof type === 'string' && type.toLowerCase() === 'array' && typeof schema.items === 'object' && typeof schema.items.type !== 'undefined') {
            var arrType = "array<"+this.dataType(schema.items, true, level+1)+">";
            if (typeof schema.format === 'string') {
                if (level == 0) {
                    return schema.format + (short ? ":" + arrType : " ("+arrType+")");
                }
                else {
                    return schema.format;
                }
            }
            else {
                return arrType;
            }
        }
        else if (typeof type === 'string' && typeof schema.format === 'string') {
            return schema.format + (short ? ":" + type : " ("+type+")");
        }
        return type;
    },

    isAnyType: function(schema) {
		return (typeof schema !== 'object' || (typeof schema.type === 'undefined' && typeof schema.oneOf === 'undefined' && typeof schema.allOf === 'undefined' && typeof schema.anyOf === 'undefined'));
    },

    htmlentities: function(str) {
        if (typeof str === 'string') {
            return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        }
        else {
            return str;
        }
    },
    
    countObjectKeys(data) {
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
    },

    isTableLike(data) {
        if (typeof data !== 'object' || data === null) {
            return false;
        }

        var countedKeys = this.countObjectKeys(data);
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

        return false;
    },

	isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
    },

    prettifyString(s) {
        if(Utils.isNumeric(s)) {
            return s;
        } else {
            // Camelcase converter
            s = s.replace(/([a-z])([A-Z])/g, '$1 $2');
            // Kebab case converter
            s = s.replace(/([a-zA-Z\d])_([a-zA-Z\d])/g, '$1 $2');
            // Uppercase the first letter in the first word
            return s.charAt(0).toUpperCase() + s.substr(1);
        }
    },

    prettifyAbbreviation(s) {
        if (typeof s === 'string' && s.match(/[A-Z]+/) === null) {
            return s.toUpperCase();
        }
        return s;
    }

};

export default Utils;