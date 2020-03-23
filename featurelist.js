var FeatureList = {

	// Manual assignment of the endpoints above to individual features.
	// A functionality is considered supported when ALL of the corresponding endpoints are supported.
	features: {
		'Basic functionality': [
			'get /collections',
			'get /collections/{collection_id}',
			'get /processes',
			'get /file_formats',
	//		'get /conformance'					// Only needed for OGC compliance
	//		'get /credentials/basic',			// Should only be used for dev purposes
			'get /credentials/oidc',
			'get /me'
		],
		'Synchronous processing': [
			'post /result'
		],
		'Batch processing': [
			'get /jobs',
			'post /jobs',
			'get /jobs/{job_id}',
	//		'patch /jobs/{job_id}',				// not necessarily needed (can be achieved by deleting and re-creating)
			'delete /jobs/{job_id}',
			'get /jobs/{job_id}/logs',
			'get /jobs/{job_id}/results',
			'post /jobs/{job_id}/results',
	// 		'delete /jobs/{job_id}/results'		// not necessarily needed (can be deleted by deleting the entire job)
		],
		'Estimate processing costs': [
			'get /jobs/{job_id}/estimate'
		],
		'Additional web services': [
			'get /service_types',
			'get /services',
			'post /services',
			'get /services/{service_id}',
	//		'patch /services/{service_id}',		// not necessarily needed (can be achieved by deleting and re-creating)
			'delete /services/{service_id}',
			'get /services/{service_id}/logs'
		],
		'File storage': [
			'get /files',
			'get /files/{path}',
			'put /files/{path}',
			'delete /files/{path}'
		],
		'User-defined processes': [
//			'post /validation',					// not necessarily needed (can be achieved by sending a process to one of the other endpoints)
			'get /process_graphs',
			'get /process_graphs/{process_graph_id}',
	 		'put /process_graphs/{process_graph_id}',
			'delete /process_graphs/{process_graph_id}'
		],
		'User defined functions (UDF)': [
			'get /udf_runtimes'
		]
	}

};

module.exports = FeatureList;