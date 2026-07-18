import type { ApiError } from "@cognix/types";
import type {
  LoginRequest,
  LogoutRequest,
  PasswordResetConfirm,
  PasswordResetRequest,
  RefreshRequest,
  RegisterRequest,
  TokenResponse,
  VerifyEmailRequest,
} from "@cognix/types";
import type { User } from "@cognix/types";
import type { Organization, Membership } from "@cognix/types";
import type { Workspace, WorkspaceMember } from "@cognix/types";
import type {
  Project,
  ProjectMember,
  ProjectRole,
  ProjectVisibility,
  ProjectStatus,
} from "@cognix/types";
import type { Invitation } from "@cognix/types";
import type { UserPreference, UpdatePreferenceRequest } from "@cognix/types";

import { CognixApiError } from "./errors.js";

/** Configuration for the {@link CognixClient}. */
export interface CognixClientOptions {
  /** Base URL of the Cognix API, e.g. `http://localhost:8000`. */
  baseUrl: string;
  /** Optional bearer token attached to every request. */
  token?: string;
  /** Custom fetch implementation (defaults to the global `fetch`). */
  fetch?: typeof fetch;
}

/** Reported health of the API. */
export interface HealthStatus {
  status: "ok";
  service: string;
  version: string;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  params?: Record<string, string>;
}

/** Standard API data envelope. */
interface DataEnvelope<T> {
  data: T;
}

/**
 * Typed HTTP client for the Cognix API.
 * Organised into namespaced sub-clients (auth, users, organizations, etc.)
 */
export class CognixClient {
  private readonly baseUrl: string;
  private readonly token: string | undefined;
  private readonly fetchImpl: typeof fetch;

  public readonly auth: AuthClient;
  public readonly users: UsersClient;
  public readonly organizations: OrganizationsClient;
  public readonly workspaces: WorkspacesClient;
  public readonly projects: ProjectsClient;
  public readonly invitations: InvitationsClient;
  public readonly preferences: PreferencesClient;

  constructor(options: CognixClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.token = options.token;
    this.fetchImpl = options.fetch ?? globalThis.fetch;

    this.auth = new AuthClient(this);
    this.users = new UsersClient(this);
    this.organizations = new OrganizationsClient(this);
    this.workspaces = new WorkspacesClient(this);
    this.projects = new ProjectsClient(this);
    this.invitations = new InvitationsClient(this);
    this.preferences = new PreferencesClient(this);
  }

  /** Liveness/health probe for the API. */
  health(signal?: AbortSignal): Promise<HealthStatus> {
    return this.request<HealthStatus>("/health", signal !== undefined ? { signal } : {});
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    let url = `${this.baseUrl}${path}`;
    if (options.params) {
      const qs = new URLSearchParams(options.params).toString();
      url = `${url}?${qs}`;
    }

    const response = await this.fetchImpl(url, {
      method: options.method ?? "GET",
      headers,
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
      ...(options.signal !== undefined ? { signal: options.signal } : {}),
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw new CognixApiError(response.status, error);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  private async parseError(response: Response): Promise<ApiError> {
    try {
      const payload = (await response.json()) as { error?: ApiError; detail?: ApiError };
      if (payload.error) return payload.error;
      if (payload.detail) return payload.detail;
    } catch {
      // Fall through to generic error
    }
    return { code: "request_failed", message: response.statusText || "Request failed" };
  }
}

// ─── Sub-clients ───────────────────────────────────────────────────────────────

class AuthClient {
  constructor(private readonly http: CognixClient) {}

  async register(body: RegisterRequest): Promise<TokenResponse> {
    const r = await this.http.request<DataEnvelope<TokenResponse>>("/api/v1/auth/register", {
      method: "POST",
      body,
    });
    return r.data;
  }

  async login(body: LoginRequest): Promise<TokenResponse> {
    const r = await this.http.request<DataEnvelope<TokenResponse>>("/api/v1/auth/login", {
      method: "POST",
      body,
    });
    return r.data;
  }

  async refresh(body: RefreshRequest): Promise<TokenResponse> {
    const r = await this.http.request<DataEnvelope<TokenResponse>>("/api/v1/auth/refresh", {
      method: "POST",
      body,
    });
    return r.data;
  }

  async logout(body: LogoutRequest): Promise<void> {
    await this.http.request<undefined>("/api/v1/auth/logout", { method: "POST", body });
  }

  async requestPasswordReset(body: PasswordResetRequest): Promise<void> {
    await this.http.request<undefined>("/api/v1/auth/password-reset", { method: "POST", body });
  }

  async confirmPasswordReset(body: PasswordResetConfirm): Promise<void> {
    await this.http.request<undefined>("/api/v1/auth/password-reset/confirm", {
      method: "POST",
      body,
    });
  }

  async verifyEmail(body: VerifyEmailRequest): Promise<User> {
    const r = await this.http.request<DataEnvelope<User>>("/api/v1/auth/verify-email", {
      method: "POST",
      body,
    });
    return r.data;
  }

  async me(): Promise<User> {
    const r = await this.http.request<DataEnvelope<User>>("/api/v1/auth/me");
    return r.data;
  }
}

class UsersClient {
  constructor(private readonly http: CognixClient) {}

  async me(): Promise<User> {
    const r = await this.http.request<DataEnvelope<User>>("/api/v1/users/me");
    return r.data;
  }

  async update(body: { name?: string; avatar_url?: string }): Promise<User> {
    const r = await this.http.request<DataEnvelope<User>>("/api/v1/users/me", {
      method: "PATCH",
      body,
    });
    return r.data;
  }

  async deleteAccount(): Promise<void> {
    await this.http.request<undefined>("/api/v1/users/me", { method: "DELETE" });
  }
}

class OrganizationsClient {
  constructor(private readonly http: CognixClient) {}

  async create(body: { name: string }): Promise<Organization> {
    const r = await this.http.request<DataEnvelope<Organization>>("/api/v1/organizations/", {
      method: "POST",
      body,
    });
    return r.data;
  }

  async get(orgId: string): Promise<Organization> {
    const r = await this.http.request<DataEnvelope<Organization>>(`/api/v1/organizations/${orgId}`);
    return r.data;
  }

  async update(
    orgId: string,
    body: { name?: string; slug?: string; logo_url?: string },
  ): Promise<Organization> {
    const r = await this.http.request<DataEnvelope<Organization>>(
      `/api/v1/organizations/${orgId}`,
      { method: "PATCH", body },
    );
    return r.data;
  }

  async members(orgId: string): Promise<Membership[]> {
    const r = await this.http.request<DataEnvelope<Membership[]>>(
      `/api/v1/organizations/${orgId}/members`,
    );
    return r.data;
  }

  async removeMember(orgId: string, userId: string): Promise<void> {
    await this.http.request<undefined>(`/api/v1/organizations/${orgId}/members/${userId}`, {
      method: "DELETE",
    });
  }
}

class WorkspacesClient {
  constructor(private readonly http: CognixClient) {}

  async create(orgId: string, body: { name: string; description?: string }): Promise<Workspace> {
    const r = await this.http.request<DataEnvelope<Workspace>>("/api/v1/workspaces/", {
      method: "POST",
      body,
      params: { org_id: orgId },
    });
    return r.data;
  }

  async get(workspaceId: string): Promise<Workspace> {
    const r = await this.http.request<DataEnvelope<Workspace>>(`/api/v1/workspaces/${workspaceId}`);
    return r.data;
  }

  async update(
    workspaceId: string,
    body: { name?: string; description?: string },
  ): Promise<Workspace> {
    const r = await this.http.request<DataEnvelope<Workspace>>(
      `/api/v1/workspaces/${workspaceId}`,
      { method: "PATCH", body },
    );
    return r.data;
  }

  async delete(workspaceId: string): Promise<void> {
    await this.http.request<undefined>(`/api/v1/workspaces/${workspaceId}`, { method: "DELETE" });
  }

  async members(workspaceId: string): Promise<WorkspaceMember[]> {
    const r = await this.http.request<DataEnvelope<WorkspaceMember[]>>(
      `/api/v1/workspaces/${workspaceId}/members`,
    );
    return r.data;
  }

  async projects(workspaceId: string): Promise<Project[]> {
    const r = await this.http.request<DataEnvelope<Project[]>>(
      `/api/v1/workspaces/${workspaceId}/projects`,
    );
    return r.data;
  }
}

class InvitationsClient {
  constructor(private readonly http: CognixClient) {}

  async invite(
    orgId: string,
    body: { email: string; role_name?: string; workspace_id?: string },
  ): Promise<Invitation> {
    const r = await this.http.request<DataEnvelope<Invitation>>("/api/v1/invitations/", {
      method: "POST",
      body,
      params: { org_id: orgId },
    });
    return r.data;
  }

  async getByToken(token: string): Promise<Invitation> {
    const r = await this.http.request<DataEnvelope<Invitation>>(
      `/api/v1/invitations/by-token/${token}`,
    );
    return r.data;
  }

  async accept(token: string): Promise<Membership> {
    const r = await this.http.request<DataEnvelope<Membership>>("/api/v1/invitations/accept", {
      method: "POST",
      body: { token },
    });
    return r.data;
  }

  async reject(invitationId: string): Promise<void> {
    await this.http.request<undefined>(`/api/v1/invitations/${invitationId}/reject`, {
      method: "POST",
    });
  }

  async resend(invitationId: string): Promise<Invitation> {
    const r = await this.http.request<DataEnvelope<Invitation>>(
      `/api/v1/invitations/${invitationId}/resend`,
      { method: "POST" },
    );
    return r.data;
  }
}

class PreferencesClient {
  constructor(private readonly http: CognixClient) {}

  async get(): Promise<UserPreference> {
    const r = await this.http.request<DataEnvelope<UserPreference>>("/api/v1/preferences/me");
    return r.data;
  }

  async update(body: UpdatePreferenceRequest): Promise<UserPreference> {
    const r = await this.http.request<DataEnvelope<UserPreference>>("/api/v1/preferences/me", {
      method: "PATCH",
      body,
    });
    return r.data;
  }
}

class ProjectsClient {
  constructor(private readonly http: CognixClient) {}

  async create(
    workspaceId: string,
    body: {
      name: string;
      description?: string;
      emoji?: string;
      color?: string;
      visibility?: ProjectVisibility;
      settings?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    },
  ): Promise<Project> {
    const r = await this.http.request<DataEnvelope<Project>>("/api/v1/projects/", {
      method: "POST",
      body,
      params: { workspace_id: workspaceId },
    });
    return r.data;
  }

  async get(projectId: string): Promise<Project> {
    const r = await this.http.request<DataEnvelope<Project>>(`/api/v1/projects/${projectId}`);
    return r.data;
  }

  async update(
    projectId: string,
    body: {
      name?: string;
      description?: string;
      emoji?: string;
      color?: string;
      visibility?: ProjectVisibility;
      status?: ProjectStatus;
      settings?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    },
  ): Promise<Project> {
    const r = await this.http.request<DataEnvelope<Project>>(`/api/v1/projects/${projectId}`, {
      method: "PATCH",
      body,
    });
    return r.data;
  }

  async delete(projectId: string): Promise<void> {
    await this.http.request<undefined>(`/api/v1/projects/${projectId}`, { method: "DELETE" });
  }

  async archive(projectId: string): Promise<Project> {
    const r = await this.http.request<DataEnvelope<Project>>(
      `/api/v1/projects/${projectId}/archive`,
      { method: "POST" },
    );
    return r.data;
  }

  async restore(projectId: string): Promise<Project> {
    const r = await this.http.request<DataEnvelope<Project>>(
      `/api/v1/projects/${projectId}/restore`,
      { method: "POST" },
    );
    return r.data;
  }

  async members(projectId: string): Promise<ProjectMember[]> {
    const r = await this.http.request<DataEnvelope<ProjectMember[]>>(
      `/api/v1/projects/${projectId}/members`,
    );
    return r.data;
  }

  async addMember(projectId: string, userId: string, role: ProjectRole): Promise<ProjectMember> {
    const r = await this.http.request<DataEnvelope<ProjectMember>>(
      `/api/v1/projects/${projectId}/members`,
      { method: "POST", body: { user_id: userId, role } },
    );
    return r.data;
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    await this.http.request<undefined>(`/api/v1/projects/${projectId}/members/${userId}`, {
      method: "DELETE",
    });
  }
}
