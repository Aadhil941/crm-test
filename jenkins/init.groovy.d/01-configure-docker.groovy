// Configure Docker for Jenkins
// This script runs on Jenkins startup to configure Docker settings

import jenkins.model.Jenkins
import hudson.model.Node
import hudson.slaves.EnvironmentVariablesNodeProperty
import hudson.slaves.EnvironmentVariablesNodeProperty.Entry

// Get Jenkins instance
def jenkins = Jenkins.getInstance()

// Configure global environment variables for Docker
def globalNodeProperties = jenkins.getGlobalNodeProperties()
def envVarsNodePropertyList = globalNodeProperties.getAll(EnvironmentVariablesNodeProperty.class)

if (envVarsNodePropertyList.isEmpty()) {
    def envVarsNodeProperty = new EnvironmentVariablesNodeProperty()
    globalNodeProperties.add(envVarsNodeProperty)
    envVarsNodePropertyList.add(envVarsNodeProperty)
}

def envVars = envVarsNodePropertyList.get(0).getEnvVars()

// Set Docker-related environment variables
envVars.put("DOCKER_HOST", "unix:///var/run/docker.sock")
envVars.put("COMPOSE_HTTP_TIMEOUT", "300")

println("Docker configuration applied to Jenkins")

