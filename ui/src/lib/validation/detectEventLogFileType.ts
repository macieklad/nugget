import { FilePondOptions } from "filepond"

export const detectEventLogFileType: FilePondOptions['fileValidateTypeDetectType'] =
(source, type) =>
  new Promise((resolve, reject) => {
    // @ts-expect-error
    if (source.name.includes('.xes')) {
      resolve('text/xml')
      return
    }

    if ('application/vnd.ms-excel' === type) {
      resolve('text/csv')
      return
    }

    resolve(type)
  })