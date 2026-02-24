# =============================================================================
# Mermaid Tunner - Highly Customizable Dockerfile
# =============================================================================
# Build with custom arguments:
#   docker build \
#     --build-arg NODE_VERSION=22 \
#     --build-arg PACKAGE_MANAGER=npm \
#     --build-arg PORT=3000 \
#     -t mermaid-tunner .
# =============================================================================

# -----------------------------------------------------------------------------
# Build Arguments - Customize your build
# -----------------------------------------------------------------------------

# Node.js version (18, 20, 22, latest)
ARG NODE_VERSION=22

# Base image variant (alpine, slim, bookworm)
ARG NODE_VARIANT=alpine

# Package manager (npm, yarn, pnpm)
ARG PACKAGE_MANAGER=npm

# Application port
ARG PORT=3000

# Build mode (production, development)
ARG BUILD_MODE=production

# Enable standalone output for smaller image
ARG NEXT_STANDALONE=true

# Telemetry (true/false)
ARG NEXT_TELEMETRY_DISABLED=true

# Sharp optimization for images (true/false)
ARG ENABLE_SHARP=true

# User configuration
ARG APP_USER=nextjs
ARG APP_GROUP=nodejs
ARG APP_UID=1001
ARG APP_GID=1001

# =============================================================================
# Stage 1: Dependencies
# =============================================================================
FROM node:${NODE_VERSION}-${NODE_VARIANT} AS deps

ARG PACKAGE_MANAGER
ARG ENABLE_SHARP

WORKDIR /app

# Install libc6-compat for Alpine compatibility
RUN if [ -f /etc/alpine-release ]; then apk add --no-cache libc6-compat; fi

# Install package manager if needed
RUN if [ "$PACKAGE_MANAGER" = "pnpm" ]; then \
      corepack enable && corepack prepare pnpm@latest --activate; \
    elif [ "$PACKAGE_MANAGER" = "yarn" ]; then \
      corepack enable && corepack prepare yarn@stable --activate; \
    fi

# Copy package files
COPY package.json ./
COPY package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies based on package manager
RUN if [ "$PACKAGE_MANAGER" = "pnpm" ]; then \
      pnpm install --frozen-lockfile; \
    elif [ "$PACKAGE_MANAGER" = "yarn" ]; then \
      yarn install --frozen-lockfile; \
    else \
      npm ci; \
    fi

# Install sharp for image optimization if enabled
RUN if [ "$ENABLE_SHARP" = "true" ]; then \
      if [ "$PACKAGE_MANAGER" = "pnpm" ]; then \
        pnpm add sharp; \
      elif [ "$PACKAGE_MANAGER" = "yarn" ]; then \
        yarn add sharp; \
      else \
        npm install sharp; \
      fi \
    fi

# =============================================================================
# Stage 2: Builder
# =============================================================================
FROM node:${NODE_VERSION}-${NODE_VARIANT} AS builder

ARG PACKAGE_MANAGER
ARG NEXT_STANDALONE
ARG NEXT_TELEMETRY_DISABLED
ARG BUILD_MODE

WORKDIR /app

# Install package manager if needed
RUN if [ "$PACKAGE_MANAGER" = "pnpm" ]; then \
      corepack enable && corepack prepare pnpm@latest --activate; \
    elif [ "$PACKAGE_MANAGER" = "yarn" ]; then \
      corepack enable && corepack prepare yarn@stable --activate; \
    fi

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED}
ENV NODE_ENV=${BUILD_MODE}

# Build the application
RUN if [ "$PACKAGE_MANAGER" = "pnpm" ]; then \
      pnpm run build; \
    elif [ "$PACKAGE_MANAGER" = "yarn" ]; then \
      yarn build; \
    else \
      npm run build; \
    fi

# =============================================================================
# Stage 3: Production Runner
# =============================================================================
FROM node:${NODE_VERSION}-${NODE_VARIANT} AS runner

ARG PORT
ARG APP_USER
ARG APP_GROUP
ARG APP_UID
ARG APP_GID
ARG NEXT_STANDALONE
ARG BUILD_MODE

WORKDIR /app

# Set environment variables
ENV NODE_ENV=${BUILD_MODE}
ENV PORT=${PORT}
ENV HOSTNAME="0.0.0.0"

# Install production essentials for Alpine
RUN if [ -f /etc/alpine-release ]; then \
      apk add --no-cache libc6-compat curl; \
    else \
      apt-get update && apt-get install -y --no-install-recommends curl && \
      rm -rf /var/lib/apt/lists/*; \
    fi

# Create non-root user
RUN addgroup --system --gid ${APP_GID} ${APP_GROUP} && \
    adduser --system --uid ${APP_UID} --ingroup ${APP_GROUP} ${APP_USER}

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} /app/.next/standalone ./
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} /app/.next/static ./.next/static

# Set ownership
RUN chown -R ${APP_USER}:${APP_GROUP} /app

# Switch to non-root user
USER ${APP_USER}

# Expose port
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/api/health || curl -f http://localhost:${PORT} || exit 1

# Start the application
CMD ["node", "server.js"]

# =============================================================================
# Stage 4: Development (optional - use with --target=development)
# =============================================================================
FROM node:${NODE_VERSION}-${NODE_VARIANT} AS development

ARG PORT
ARG PACKAGE_MANAGER

WORKDIR /app

# Install package manager if needed
RUN if [ "$PACKAGE_MANAGER" = "pnpm" ]; then \
      corepack enable && corepack prepare pnpm@latest --activate; \
    elif [ "$PACKAGE_MANAGER" = "yarn" ]; then \
      corepack enable && corepack prepare yarn@stable --activate; \
    fi

# Copy package files and install dependencies
COPY package.json ./
COPY package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN if [ "$PACKAGE_MANAGER" = "pnpm" ]; then \
      pnpm install; \
    elif [ "$PACKAGE_MANAGER" = "yarn" ]; then \
      yarn install; \
    else \
      npm install; \
    fi

# Copy source code
COPY . .

# Set environment
ENV NODE_ENV=development
ENV PORT=${PORT}

# Expose port
EXPOSE ${PORT}

# Start development server
CMD if [ "$PACKAGE_MANAGER" = "pnpm" ]; then \
      pnpm dev; \
    elif [ "$PACKAGE_MANAGER" = "yarn" ]; then \
      yarn dev; \
    else \
      npm run dev; \
    fi
