const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const router = express.Router();

function handlePythonCode(code) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, '../../CodeFiles/python/code.py');
    //   console.log(filePath);
      fs.writeFileSync(filePath, code);
  
      exec(`python ./CodeFiles/python/code.py`, (execError, execStdout, execStderr) => {
        if (execError) {
          reject({ error: execStderr || execError.message });
          return;
        }
        resolve(execStdout);
      });
    });
  }
  

  function handleJavaCode(code) {
    return new Promise((resolve, reject) => {
      const javaCode = `${code}`;
  
      // Check if the class name is Main
      if (!javaCode.includes('public class Main')) {
        reject({ error: 'Java code must contain a class named Main' });
        return;
      }
  
      const filePath = path.join(__dirname, '../../CodeFiles/java/Main.java');
    //   console.log(filePath);
      fs.writeFileSync(filePath, javaCode);
  
      exec(`javac ./CodeFiles/java/Main.java`, (compileError, compileStdout, compileStderr) => {
        if (compileError) {
          reject({ error: compileStderr || compileError.message });
          return;
        }
        
        exec(`java -cp ./CodeFiles/java Main`, (execError, execStdout, execStderr) => {
          if (execError) {
            reject({ error: execStderr || execError.message });
            return;
          }
          resolve(execStdout);
        });
      });
    });
  }

router.post('/runcode', async (req, res) => {
  const { language, code } = req.body;

  try {
    let output;

    switch (language) {
      case 'python':
        output = await handlePythonCode(code);
        break;
      case 'java':
        output = await handleJavaCode(code);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.error });
  }
});

module.exports = router;
