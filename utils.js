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
            var arrType = "array<"+this.dataType(schema.items, short, level+1)+">";
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
        else if (typeof type === 'string' && type.toLowerCase() === 'object' && typeof schema.format === 'string') {
            return schema.format + (short ? ":object" : " (object)");
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
	}

};

export default Utils;