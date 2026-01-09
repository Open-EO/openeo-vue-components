const STAC_MEDIA_TYPES = ['application/geo+json', 'application/json']

export default {
	methods: {
		isStacLinkType(link, strict = false) {
			if (typeof link.type === 'undefined') {
				return !strict;
			}
			return typeof link.type === 'string' && STAC_MEDIA_TYPES.includes(link.type.toLowerCase());
		},
		getStacLinkByRel(links, rel, strict = false) {
			if (!Array.isArray(links)) {
				return undefined;
			}
			return links.find(link => (this.isStacLinkType(link, strict) && typeof link.rel === 'string' && link.rel.toLowerCase() === rel.toLowerCase()));
		},
		getStacLinksByRels(links, rels, strict = false) {
			if (!Array.isArray(links)) {
				return [];
			}
			return links.filter(link => (this.isStacLinkType(link, strict) && typeof link.rel === 'string' && rels.includes(link.rel.toLowerCase())));
		}
  }
};