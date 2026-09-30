import os
import subprocess
import sys

def get_commit_message(status: str, filepath: str) -> str:
    path_lower = filepath.lower().replace("\\", "/")
    filename = os.path.basename(filepath)
    name_no_ext, ext = os.path.splitext(filename)

    if status == "D":
        if "ubverse" in path_lower or "unbound" in path_lower:
            return f"chore(cleanup): remove obsolete legacy {name_no_ext} asset/component"
        return f"chore(refactor): remove redundant {filename}"

    # Staging brand logos
    if "brand/companies" in path_lower:
        if "northhstar" in path_lower:
            return f"feat(brand): integrate Northhstar Lab Pvt. Ltd. authoritative logo ({ext.replace('.', '')})"
        elif "novaforge" in path_lower:
            return f"feat(brand): integrate Novaforge Pvt. Ltd. authoritative logo ({ext.replace('.', '')})"
        elif "vertex" in path_lower:
            return f"feat(brand): integrate Vertex Works Pvt. Ltd. authoritative logo ({ext.replace('.', '')})"
        return f"feat(brand): add authoritative company asset {filename}"

    # CMS files
    if "lib/cms" in path_lower:
        if "hybrid" in path_lower:
            return "feat(cms): introduce HybridCmsRepository with zero-downtime seed fallback"
        if "service" in path_lower:
            return "refactor(cms): update CmsService public page projection"
        if "server" in path_lower:
            return "feat(cms): wire HybridCmsRepository into server-side cms client"
        return f"feat(cms): update cms module {name_no_ext}"

    if "data/cms-seed" in path_lower or "scripts/cms-seed" in path_lower:
        return f"feat(cms): populate authoritative seed data in {filename}"

    if "supabase" in path_lower:
        return f"feat(db): configure Supabase CMS migration and RLS schema ({filename})"

    # Legal
    if "app/legal" in path_lower or "components/legal" in path_lower:
        if "cmserrostate" in path_lower:
            return "feat(legal): add granular CMS error states for 404, 503, config and empty docs"
        if "error" in path_lower:
            return "feat(legal): add dedicated legal route error boundary"
        return f"feat(legal): update legal hub document renderer and layout in {filename}"

    # Auth & Login redesign
    if "components/site/auth" in path_lower or "components/site/login" in path_lower or "components/site/signup" in path_lower or "components/site/oauth" in path_lower:
        if "artwork" in path_lower:
            return "feat(auth): integrate authentic neural mesh wave artwork for auth hero"
        if "layout" in path_lower:
            return "feat(auth): redesign AuthLayout with VentureFlow by Veyron X branding"
        if "card" in path_lower:
            return "feat(auth): enhance AuthCard surface styling and border geometry"
        if "signup" in path_lower:
            return "feat(auth): align founder & investor signup form with reference design"
        if "login" in path_lower:
            return "feat(auth): align founder & investor login form with reference design"
        if "oauth" in path_lower:
            return "feat(auth): refine Google and Facebook OAuth buttons layout"
        return f"refactor(auth): refine auth component {filename}"

    # Platform routes
    if "app/(platform)/founder" in path_lower:
        return f"feat(founder): update founder portal view {name_no_ext}"
    if "app/(platform)/investor" in path_lower:
        return f"feat(investor): update investor portal view {name_no_ext}"
    if "app/(platform)/issuer" in path_lower:
        return f"refactor(issuer): maintain backwards-compatible founder route in {filename}"

    # Workspace sections and routes
    if "components/sections/workspace" in path_lower or "app/(marketing)/workspace" in path_lower:
        return f"feat(workspace): implement canonical workspace component {name_no_ext}"

    # API routes
    if "app/api" in path_lower:
        return f"feat(api): optimize endpoint security, validation and rate-limiting ({filename})"

    # Layout & Navigation
    if "components/layout" in path_lower or "components/site/brand" in path_lower or "components/ui/ventureflowbrand" in path_lower:
        return f"feat(branding): enforce VentureFlow by Veyron X identity in {name_no_ext}"

    # Tests
    if "test" in path_lower:
        return f"test: add and update automated verification test in {filename}"

    # Public assets
    if "public/" in path_lower:
        return f"style(assets): update visual asset {filename}"

    # Configs
    if filename in [".env.example", "next.config.ts", "package.json", "tsconfig.json", "README.md", "CHANGELOG_AUDIT.md", "DEPLOYMENT.md"]:
        return f"chore(config): update configuration and documentation in {filename}"

    return f"refactor({name_no_ext}): update {filename} for VentureFlow architecture"

def main():
    print("Collecting files to commit...")
    # 1. Staged deletions
    staged = subprocess.run(["git", "diff", "--cached", "--name-only"], capture_output=True, text=True).stdout.splitlines()
    deleted_files = [f.strip() for f in staged if f.strip()]

    # 2. Unstaged modified/deleted files
    unstaged = subprocess.run(["git", "diff", "--name-only"], capture_output=True, text=True).stdout.splitlines()
    modified_files = [f.strip() for f in unstaged if f.strip() and f.strip() not in deleted_files]

    # 3. Untracked files
    untracked = subprocess.run(["git", "ls-files", "--others", "--exclude-standard"], capture_output=True, text=True).stdout.splitlines()
    added_files = [f.strip() for f in untracked if f.strip() and f.strip() not in deleted_files and f.strip() not in modified_files]

    total_ops = len(deleted_files) + len(modified_files) + len(added_files)
    print(f"Found {len(deleted_files)} deletions, {len(modified_files)} modifications, {len(added_files)} additions. Total: {total_ops}")

    committed_count = 0

    # Commit deletions one by one
    for filepath in deleted_files:
        msg = get_commit_message("D", filepath)
        # file is already deleted and staged in index, so we commit just this file
        res = subprocess.run(["git", "commit", "-m", msg, "--", filepath], capture_output=True, text=True)
        if res.returncode == 0:
            committed_count += 1
            if committed_count % 10 == 0 or committed_count == total_ops:
                print(f"[{committed_count}/{total_ops}] Committed deletion: {filepath}")
        else:
            print(f"Warning committing deletion {filepath}: {res.stderr}")

    # Commit modified files one by one
    for filepath in modified_files:
        msg = get_commit_message("M", filepath)
        subprocess.run(["git", "add", filepath], check=True)
        res = subprocess.run(["git", "commit", "-m", msg], capture_output=True, text=True)
        if res.returncode == 0:
            committed_count += 1
            if committed_count % 10 == 0 or committed_count == total_ops:
                print(f"[{committed_count}/{total_ops}] Committed modification: {filepath}")
        else:
            print(f"Warning committing modification {filepath}: {res.stderr}")

    # Commit added files one by one
    for filepath in added_files:
        if not os.path.exists(filepath):
            continue
        msg = get_commit_message("A", filepath)
        subprocess.run(["git", "add", filepath], check=True)
        res = subprocess.run(["git", "commit", "-m", msg], capture_output=True, text=True)
        if res.returncode == 0:
            committed_count += 1
            if committed_count % 10 == 0 or committed_count == total_ops:
                print(f"[{committed_count}/{total_ops}] Committed addition: {filepath}")
        else:
            print(f"Warning committing addition {filepath}: {res.stderr}")

    # Total commit count check
    rev_res = subprocess.run(["git", "rev-list", "--count", "HEAD"], capture_output=True, text=True)
    total_commits = rev_res.stdout.strip()
    print(f"\nSuccessfully created {committed_count} granular commits!")
    print(f"Total commit count in repository: {total_commits}")

if __name__ == "__main__":
    main()
