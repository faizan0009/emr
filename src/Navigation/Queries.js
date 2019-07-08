export const searchQuery = 
`
unwind $search as search
with search.globalsearch+'~' as search
call db.index.fulltext.queryNodes("searchbarname", search) yield node, score
return node, score order by score desc limit 10
`