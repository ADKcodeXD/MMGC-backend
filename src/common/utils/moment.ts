import moment from 'moment'

export const formatTime = (time: string, format = 'YYYY-MM-DD HH:mm:ss') => {
	return moment(time).format(format)
}
