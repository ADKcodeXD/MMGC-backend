import { JSONSchemaType } from 'ajv'
import { MovieParams, MovieUpdateParams } from 'Movie'

export const movieParamsSchema: JSONSchemaType<MovieParams> = {
	type: 'object',
	definitions: {
		i18n: {
			$id: '#i18n',
			type: 'object',
			properties: {
				cn: { type: 'string' },
				jp: { type: 'string', nullable: true },
				en: { type: 'string', nullable: true }
			},
			required: ['cn'],
			additionalProperties: false
		},
		snsSite: {
			$id: '#snsSite',
			type: 'object',
			nullable: true,
			properties: {
				bilibili: { type: 'string', nullable: true },
				youtube: { type: 'string', nullable: true },
				personalWebsite: { type: 'string', nullable: true },
				niconico: { type: 'string', nullable: true },
				twitter: { type: 'string', nullable: true }
			},
			required: [],
			additionalProperties: false
		},
		downLoad: {
			$id: '#download',
			type: 'object',
			nullable: true,
			properties: {
				baidu: { type: 'string', nullable: true },
				google: { type: 'string', nullable: true },
				other: { type: 'string', nullable: true },
				onedrive: { type: 'string', nullable: true }
			},
			required: [],
			additionalProperties: false
		}
	},
	properties: {
		movieName: { $ref: '#i18n' },
		movieCover: { type: 'string' },
		movieDesc: { $ref: '#i18n' },
		moviePlaylink: { $ref: '#i18n' },
		movieLink: { $ref: '#snsSite' },
		movieDownloadLink: { $ref: '#download' },
		activityId: { type: 'integer', nullable: true },
		day: { type: 'integer', nullable: true },
		isOrigin: { type: 'number', nullable: true },
		expectPlayTime: { type: 'string', nullable: true },
		realPublishTime: { type: 'string', nullable: true },
		authorId: { type: 'integer', nullable: true },
		authorName: { type: 'string', nullable: true }
	},
	required: ['movieName', 'movieCover', 'movieDesc', 'moviePlaylink'],
	additionalProperties: false
}

export const movieUpdateParamsSchema: JSONSchemaType<MovieUpdateParams> = {
	type: 'object',
	definitions: {
		i18n: {
			$id: '#i18n',
			type: 'object',
			properties: {
				cn: { type: 'string' },
				jp: { type: 'string', nullable: true },
				en: { type: 'string', nullable: true }
			},
			required: ['cn'],
			additionalProperties: false
		},
		snsSite: {
			$id: '#snsSite',
			type: 'object',
			nullable: true,
			properties: {
				bilibili: { type: 'string', nullable: true },
				youtube: { type: 'string', nullable: true },
				personalWebsite: { type: 'string', nullable: true },
				niconico: { type: 'string', nullable: true },
				twitter: { type: 'string', nullable: true }
			},
			required: [],
			additionalProperties: false
		},
		downLoad: {
			$id: '#download',
			type: 'object',
			nullable: true,
			properties: {
				baidu: { type: 'string', nullable: true },
				google: { type: 'string', nullable: true },
				other: { type: 'string', nullable: true },
				onedrive: { type: 'string', nullable: true }
			},
			required: [],
			additionalProperties: false
		}
	},
	properties: {
		movieName: { $ref: '#i18n' },
		movieCover: { type: 'string' },
		movieDesc: { $ref: '#i18n' },
		moviePlaylink: { $ref: '#i18n' },
		movieLink: { $ref: '#snsSite' },
		movieId: { type: 'integer' },
		movieDownloadLink: { $ref: '#download' },
		activityId: { type: 'integer', nullable: true },
		day: { type: 'integer', nullable: true },
		isOrigin: { type: 'number', nullable: true },
		expectPlayTime: { type: 'string', nullable: true },
		realPublishTime: { type: 'string', nullable: true },
		authorId: { type: 'integer', nullable: true },
		authorName: { type: 'string', nullable: true }
	},
	required: ['movieName', 'movieCover', 'movieDesc', 'moviePlaylink', 'movieId'],
	additionalProperties: true
}
