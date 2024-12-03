const { Builder, By, Capabilities, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

// Ruta al archivo HTML local
const url = "file:///C:/proyecto/ProgramaGitFlow/index.html"; // Cambia esta ruta según la ubicación de tu archivo

// Especifica la ruta de la carpeta donde se guardarán las capturas de pantalla
const screenshotPath = path.join(__dirname, 'fotos');

// Configuración de las capacidades de Microsoft Edge
const edgeCapabilities = Capabilities.edge();
edgeCapabilities.set('acceptSslCerts', true);

// Función para capturar pantallas
async function takeScreenshot(driver, stepName) {
    // Verifica si la carpeta fotos existe, si no, la crea
    if (!fs.existsSync(screenshotPath)) fs.mkdirSync(screenshotPath);
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(`${screenshotPath}/${stepName}.png`, screenshot, 'base64');
}

// Pruebas automatizadas
async function runTests() {
    const driver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .withCapabilities(edgeCapabilities) // Usar las capacidades de Edge con SSL habilitado
        .build();

    try {
        await driver.get(url);

        // Espera hasta que la página se haya cargado completamente
        await driver.wait(until.titleIs('TaskFlow'), 10000); // Cambia 'TaskFlow' al título correcto de tu página

        // Prueba 1: Captura de pantalla al abrir la página
        console.log("Prueba 1: Captura de pantalla al abrir la página");
        await takeScreenshot(driver, "page_opened");

        // Prueba 2: Agregar una tarea
        console.log("Prueba 2: Agregar una tarea");
        const taskInput = await driver.findElement(By.id('input'));
        const addTaskBtn = await driver.findElement(By.id('boton-enter'));
        await taskInput.sendKeys('Nueva tarea de prueba');
        await addTaskBtn.click();
        await takeScreenshot(driver, "task_added");

        // Prueba 3: Completar una tarea
        console.log("Prueba 3: Completar una tarea");
        const completeTaskBtn = await driver.findElement(By.css('.text'));
        await completeTaskBtn.click();
        await takeScreenshot(driver, "task_completed");

        // Prueba 4: Eliminar una tarea
        console.log("Prueba 4: Eliminar una tarea");
        const deleteTaskBtn = await driver.findElement(By.css('.de'));
        await deleteTaskBtn.click();
        await takeScreenshot(driver, "task_deleted");

    } catch (error) {
        console.error("Error durante las pruebas:", error);
    } finally {
        // await driver.quit();
    }
}

// Ejecutar pruebas
runTests();
