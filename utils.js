var Utils = {

    convertProcessToLatestSpec: function(originalProcess, version = '') {
        var process = Object.assign({}, originalProcess);
        // convert v0.3 processes to v0.4 format
        if (version.substr(0,3) === '0.3' || typeof process.id === 'undefined') {
            // name => id
            process.id = process.name;
            delete process.name;
            // mime_type => media_type
            if (typeof process.parameters === 'object') {
                for(var key in process.parameters) {
                    var param = process.parameters[key];
                    if (typeof param.mime_type !== 'undefined') {
                        param.media_type = param.mime_type;
                        delete param.mime_type;
                    }
                }
            }
            if (typeof process.returns.mime_type !== 'undefined') {
                process.returns.media_type = process.returns.mime_type;
                delete process.returns.mime_type;
            }
            // exception object
            if (process.exceptions) {
                for(var key in process.exceptions) {
                    if (typeof process.exceptions[key].message === 'undefined') {
                        process.exceptions[key].message = process.exceptions[key].description;
                    }
                }
            }
            // examples object
            if (process.examples) {
                var examples = [];
                for(var key in process.examples) {
                    var old = process.examples[key];
                    var example = {
                        title: old.summary || key,
                        description: old.description
                    };
                    if (old.process_graph) {
                        example.process_graph = old.process_graph;
                    }
                    examples.push(example);
                }
                process.examples = examples;
            }
        }
        return process;
    },

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
            return str.replace('<',"&lt;").replace('>',"&gt;");
        }
        else {
            return str;
        }
	}

};

export default Utils;