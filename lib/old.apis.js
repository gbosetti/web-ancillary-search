SearchTool.prototype.getGoodreadsApi = function() {
	
	var me = this;

	var renderImage = function(data, type, row) {
	    if(data != null)
	      return "<img src='"+data+"'/>";
	    return "<img src='data:image/png;base64,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'/>";
	}

	return {
		name:'GoodReads',
		url:'https://www.goodreads.com/search?q=Ficciones',
		keywords:'Ficciones',
		loadingResStrategy: "WriteAndClickToReload", 
		entry:'//input[@id="search_query_main"]',
		trigger:'//input[contains(@class, "searchBox__button")]',
		results: {
			name: 'Book ratings',
			xpath:'//table[contains(@class, "tableList")]/tbody/tr',
			properties:[
				{
					name:'Title',
					xpath:'/td[2]//span',
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Rating',
					xpath: '/td[2]//span[@class="minirating"]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Title",
					responsivePriority: 1
				},{
					title: "Rating",
					responsivePriority: 1
				}]
		}
	};
};