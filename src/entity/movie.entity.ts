import { MovieModel, MovieParams } from 'Movie'

export class MovieParamsEntity implements MovieParams {
	movieCover = ''
	movieName = {
		cn: ''
	}
	movieDesc = {
		cn: ''
	}
	moviePlaylink = {
		cn: ''
	}
	movieLink = null
	movieDownloadLink = null
	authorId = null
	authorName = null
	realPublishTime = null
	expectPlayTime = null
	activityId = null
	day = null
	isOrigin = 1
}

export class MovieModelEntity implements MovieModel {
	commentNums = 0
	createTime = Date.now()
	likeNums = 0
	movieId = 0
	pollNums = 0
	uploader = 0
	viewNums = 0
	movieCover = ''
	movieName = {
		cn: ''
	}
	movieDesc = {
		cn: ''
	}
	moviePlaylink = {
		cn: ''
	}
	movieLink = null
	movieDownloadLink = null
	authorId = null
	authorName = null
	realPublishTime = null
	expectPlayTime = null
	activityId = null
	day = null
	isOrigin = 1
}
