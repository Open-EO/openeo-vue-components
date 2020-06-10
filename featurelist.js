var FeatureList = {

	// Manual assignment of the endpoints above to individual features.
	// A functionality is considered supported when ALL of the corresponding endpoints are supported.
	features: {
		'Basic functionality': {
			'get /collections': 'Data discovery',
			'get /collections/{collection_id}': 'Data discovery details',
			'get /processes': 'Process discovery',
			'get /file_formats': 'File format discovery',
	//		'get /conformance': 'OGC conformance',				// Only needed for OGC compliance
	//		'get /credentials/basic': 'Basic authentication',	// Should only be used for dev purposes
			'get /credentials/oidc': 'OpenID Connect authentication',
			'get /me': 'User profiles'
		},
		'Synchronous processing': {
			'post /result': 'Synchronous processing'
		},
		'Batch processing': {
			'get /jobs': 'Overview',
			'post /jobs': 'Creating',
			'get /jobs/{job_id}': 'Status',
	//		'patch /jobs/{job_id}': 'Updating',					// not necessarily needed (can be achieved by deleting and re-creating)
			'delete /jobs/{job_id}': 'Deleting',
			'get /jobs/{job_id}/logs': 'Logs',
			'get /jobs/{job_id}/results': 'Downloading results',
			'post /jobs/{job_id}/results': 'Queuing',
	// 		'delete /jobs/{job_id}/results': 'Deleting results'	// not necessarily needed (can be deleted by deleting the entire job)
		},
		'Estimate processing costs': {
			'get /jobs/{job_id}/estimate': 'Estimate processing costs'
		},
		'Additional web services': {
			'get /service_types': 'Discovery',
			'get /services': 'Overview',
			'post /services': 'Creating',
			'get /services/{service_id}': 'Status',
	//		'patch /services/{service_id}': 'Updating',			// not necessarily needed (can be achieved by deleting and re-creating)
			'delete /services/{service_id}': 'Deleting',
			'get /services/{service_id}/logs': 'Logs'
		},
		'File storage': {
			'get /files': 'Overview',
			'get /files/{path}': 'Downloading',
			'put /files/{path}': 'Uploading',
			'delete /files/{path}': 'Deleting'
		},
		'User-defined processes': {
//			'post /validation': 'Validating',					// not necessarily needed (can be achieved by sending a process to one of the other endpoints)
			'get /process_graphs': 'Overview',
			'get /process_graphs/{process_graph_id}': 'Status',
	 		'put /process_graphs/{process_graph_id}': 'Creating',
			'delete /process_graphs/{process_graph_id}': 'Deleting'
		},
		'User-defined functions (UDF)': {
			'get /udf_runtimes': 'User-defined functions (UDF)'
		}
	}

};

module.exports = FeatureList;