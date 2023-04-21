
const SECRET_KEY = 'MY_SECRET_KEY';
const redisConnectingError = 'Error connecting to Redis:';
const redisConnectingSuccess = 'Connected to Redis successfully';
const creatingDomainError = 'Error creating domain: ';
const domainCreated = 'Domain created successfully.';
const noInformation = 'No information is registered.';
const APITokenUpdated = 'Api token has been updated';
const APITokenUpdateFail = 'Failed to update api token: ';
const domainUpdated = 'Domain updated successfully.';
const UpdateDomainError = 'Error updating domain: ';
const deleteDomain = 'Domain deleted successfully.';
const deleteDomainError = 'Error deleting domain: ';
const retreiveDomainError = 'Error retrieving domain';

module.exports = {
    SECRET_KEY,
    redisConnectingError,
    redisConnectingSuccess,
    creatingDomainError,
    domainCreated,
    noInformation,
    APITokenUpdated,
    APITokenUpdateFail,
    domainUpdated,
    UpdateDomainError,
    deleteDomain,
    deleteDomainError,
    retreiveDomainError
}