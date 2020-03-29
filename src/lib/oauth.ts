import * as OAuth2Server from 'oauth2-server';
import { AuthService } from '../shared/services/auth.service';

export const oauth = new OAuth2Server({
	refreshTokenLifetime: 60 * 3600,
	model: new AuthService(),
	accessTokenLifetime: 60 * 3600,
	allowBearerTokensInQueryString: true,
	requireClientAuthentication: {
		password: false,
		refresh_token: false,
	}
});
