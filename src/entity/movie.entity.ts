import { ActivityVo } from 'Activity'
import { MemberVo } from 'Member'
import { MovieModel, MovieParams, MovieVo } from 'Movie'

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
  sortIndex: number | null = 0
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

export class MovieVoEntity implements MovieVo {
	sortIndex: number | null  = 0
  expectPlayTime: string | null = null
  authorName: string | null = null
  isPublic: boolean | null = false
  isActivityMovie: boolean | null = false
  movieLink: Sns | null = null
  activityVo: ActivityVo | null = null
  loginVo: LoginVo | null = null
  uploader: MemberVo | null = null
  author: MemberVo | null = null
  movieCover = ''
  likeNums = 0
  movieId = 0
  pollNums = 0
  viewNums = 0
  movieName: I18N = {
    cn: ''
  }
  movieDesc: I18N = {
    cn: ''
  }
  moviePlaylink: I18N | null = {
    cn: ''
  }
  movieDownloadLink: DownloadLink | null = null
  realPublishTime: string | null = null
  day = 0
  createTime: string | null = null
  isOrigin = 1
  commentNums = 1
}
