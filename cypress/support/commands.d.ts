type MetricsOptions = {
  startMark?: keyof PerformanceTiming // Default: 'navigationStart'
  endMark?: keyof PerformanceTiming // Default: 'loadEventEnd'
  timeout?: number // Timeout in milliseconds (default: 10000)
  initialDelay?: number // Initial delay in milliseconds (default: 1000)
  retryTimeout?: number // Retry timeout in milliseconds (default: 5000)
}

type WaitUntilLog = Pick<Cypress.LogConfig, 'name' | 'message' | 'consoleProps'>

type ErrorMsgCallback<Subject = any> = (result: Subject, options: WaitUntilOptions<Subject>) => string

interface WaitUntilOptions<Subject = any> {
  timeout?: number
  interval?: number
  errorMsg?: string | ErrorMsgCallback<Subject>
  description?: string
  customMessage?: string
  verbose?: boolean
  customCheckMessage?: string
  logger?: (logOptions: WaitUntilLog) => any
  log?: boolean
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to clean up test data in Jenkins
     * @param {string[]} resources - Array of resources to delete
     * @param {boolean} [all=false] - Flag to delete all jobs, views, and nodes if set to true
     * @returns {Promise<void>} - Promise that resolves when all data has been cleaned up
     * @example
     * // Clean up specific jobs, views, and nodes
     * cy.cleanData(['job1', 'job2', 'view1', 'node1', 'node2', 'user1'])
     * @example
     * // Clean up all jobs, views, and nodes
     * cy.cleanData(null, true)
     */
    cleanData(resources: string[], all: boolean): Promise<void>
    /**
     * Custom command to print to console log
     * @example cy.print({ foo: 'bar' })
     */
    print(object: object): void
    /**
     * Creates a new item of a specific type.
     *
     * @param itemName - The name of the item to create.
     * @param itemType - The type of item to create.
     *
     * @example
     * cy.createItemByType('My New Item', 'Job');
     */
    createItemByType(itemName: string, itemType: string): Chainable<void>
    /**
     * Logs in to the application with the provided credentials.
     *
     * @param userName - The username to use for login. Defaults to `USERNAME`.
     * @param pass - The password to use for login. Defaults to `PASSWORD`.
     *
     * @example
     * cy.login('myuser', 'mypassword');
     */
    login(userName?: string, pass?: string): Chainable<void>

    /**
     * Custom command to wait until a condition is met.
     * @param subject - The value to be passed to the `checkFunction`.
     * @param checkFunction - Function that will be called repeatedly until it returns a truthy value.
     *   The function should accept a single argument, `subject`, which is the value returned by the
     *   previous command in the chain or `undefined` if no previous command was executed.
     *   The function can return a value, a `Chainable`, or a `Promise` of either.
     * @param options - Options object with the following properties:
     *   - `timeout`: The maximum time in milliseconds to wait for the condition to be met.
     *     Defaults to 5000.
     *   - `interval`: The time in milliseconds to wait between calls to `checkFunction`.
     *     Defaults to 200.
     *   - `errorMsg`: A message to be logged if the condition is not met within `timeout` milliseconds.
     *     Defaults to `'Timed out retrying'`.
     *   - `description`: A description to be used when logging the start of the wait.
     *     Defaults to `'waitUntil'`.
     *   - `customMessage`: A message to be logged if the condition is not met within `timeout` milliseconds.
     *     Defaults to `undefined`.
     *   - `verbose`: A flag indicating whether to log messages about the wait.
     *     Defaults to `false`.
     *   - `customCheckMessage`: A message to be logged for each check.
     *     Defaults to `undefined`.
     *   - `logger`: A logger function that will be called with the log message.
     *     Defaults to `Cypress.log`.
     *   - `log`: A flag indicating whether to log messages about the wait.
     *     Defaults to `true`.
     * @returns The value returned by `checkFunction` or a `Chainable` of that value.
     *
     * @example
     * cy.waitUntil(() => cy.get('#myElement').should('be.visible'))
     */
    waitUntil<ReturnType = any>(
      checkFunction: (subject: Subject | undefined) => ReturnType | Chainable<ReturnType> | Promise<ReturnType>,
      options?: WaitUntilOptions<Subject>
    ): Chainable<ReturnType>
  }
}
