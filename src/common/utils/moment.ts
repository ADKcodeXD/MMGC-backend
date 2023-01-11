import moment from 'moment'

export const formatTime = (time: any, format = 'YYYY-MM-DD HH:mm:ss') => {
	return moment(time).format(format)
}
