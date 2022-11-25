import { environment } from '../../environments/environment';

const  metaforceProjectId = (environment.production ? 1 : 9);
export {
    metaforceProjectId
}; 