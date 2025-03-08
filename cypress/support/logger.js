/* eslint-disable complexity */
const logRequestDetails = (requestDetails, response, duration, config = {}) => {
  const defaultConfig = Cypress.env('apiLoggerConfig') || {}
  const {
    enableApiLogging = true,
    maxBodyLines = 50,
    displayFields = [
      'method',
      'url',
      'status',
      'requestBody',
      'requestHeaders',
      'responseBody',
      'responseHeaders',
      'duration'
    ]
  } = { ...defaultConfig, ...config }

  if (!enableApiLogging) {
    return
  }

  const method = requestDetails.method || 'GET'
  const url = typeof requestDetails === 'string' ? requestDetails : requestDetails.url
  const requestBody = requestDetails.body || null
  const requestHeaders = requestDetails.headers || {}
  const truncatedResponseBody = response.body
    ? JSON.stringify(response.body, null, 2).split('\n').slice(0, maxBodyLines).join('\n')
    : 'No Response Body'

  let logMessage = `--- **LOGGING STARTED FOR** ${method} : ${url} \n`

  if (displayFields.includes('status')) {
    logMessage += ` | **Status**: ${response.status}\n`
  }

  if (displayFields.includes('requestHeaders') && requestHeaders) {
    logMessage += ` | **Request Headers**: ${JSON.stringify(requestHeaders, null, 2)}\n`
  }

  if (displayFields.includes('requestBody') && requestBody) {
    logMessage += ` | **Request Body**: ${JSON.stringify(requestBody, null, 2)}\n`
  }

  if (displayFields.includes('responseHeaders') && response.headers) {
    logMessage += ` | **Response Headers**: ${JSON.stringify(response.headers, null, 2)}\n`
  }

  if (displayFields.includes('responseBody') && response.body) {
    logMessage += ` | **Response Body**: \n${truncatedResponseBody}\n`
  }

  if (displayFields.includes('duration') && duration) {
    logMessage += ` | **duration is**: ${duration}ms\n`
  }

  Cypress.log({
    name: 'Custom Log',
    displayName: 'LOGGER',
    message: logMessage,
    consoleProps: () => ({
      'Request Method': method,
      'Request URL': url,
      'Request Body': requestBody,
      'Request Headers': requestHeaders,
      'Response Status': response.status,
      'Response Body': truncatedResponseBody,
      'Response Headers': JSON.stringify(response.headers, null, 2),
      'Duration (ms)': duration
    })
  })
}
Cypress.Commands.overwrite('request', (originalFn, ...args) => {
  const startTime = Date.now()

  return originalFn(...args).then(response => {
    const duration = Date.now() - startTime
    // eslint-disable-next-line prefer-destructuring
    const requestDetails = args[0]
    logRequestDetails(requestDetails, response, duration)
    return response
  })
})
