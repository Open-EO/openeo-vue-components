module.exports = {
	"collections": {
		"gee": {
			"collections": require('./examples/collections-gee.json')
		}
	},
	"collection": {
		"gee-ahn": {
			"collection": require('./examples/collection-gee-ahn.json')
		}
	},
	"processes": {
		"gee": {
			"processes": require('./examples/processes-gee.json')
		}
	},
	"udf-runtime": {
		"api": {
			"id": "R",
			"data": {
				"title": "R v3.x for Statistical Computing",
				"description": "R programming language with `Rcpp` and `rmarkdown` extensions installed.",
				"type": "language",
				"default": "3.5.2",
				"versions": {
					"3.1.0": {
						"libraries": {
							"Rcpp": {
								"version": "1.0.10",
								"links": [
									{
										"href": "https://cran.r-project.org/web/packages/Rcpp/index.html",
										"rel": "about"
									}
								]
							},
							"rmarkdown": {
								"version": "1.7.0",
								"links": [
									{
										"href": "https://cran.r-project.org/web/packages/rmarkdown/index.html",
										"rel": "about"
									}
								]
							}
						}
					},
					"3.5.2": {
						"libraries": {
							"Rcpp": {
								"version": "1.2.0",
								"links": [
									{
										"href": "https://cran.r-project.org/web/packages/Rcpp/index.html",
										"rel": "about"
									}
								]
							},
							"rmarkdown": {
								"version": "1.7.0",
								"links": [
									{
										"href": "https://cran.r-project.org/web/packages/rmarkdown/index.html",
										"rel": "about"
									}
								]
							}
						}
					}
				}
			}
		}
	},
	"udf-runtimes": {
		"api": {
			"runtimes": require('./examples/udf-runtimes-api.json')
		}
	}
}