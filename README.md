# Budget-Buddy-Frontend

### `main`
- The `main` branch is the stable branch used for deployment.
- All changes must be merged into `main` through pull requests.

### `dev`
- The `dev` branch is used for development.
- All changes must be merged into `dev` through pull requests.
- Features are merged into the `dev` branch for possible integration and testing.

## Workflow

1. **Feature Development**
   - Create a new branch from `dev` for your feature. You can name the branch based on the feature or include your name to indicate ownership. For example:
     - Naming by feature:
       
       `git checkout -b feature/new-feature`
       
       OR
       
       `git checkout -b feature/new-feature dev` (specifying base branch)
       
     - Naming by owner and feature:

       `git checkout -b eric-feature`

       OR

         `git checkout -b eric-feature dev` (specifying base branch)
   - Work on your feature branch and commit changes:
     
     `git add . (for all files)`
     
      `git add xxx.jsx (for xxx.jsx only)`
   
      `git commit -m “”`
   
   - Push your feature branch to GitHub:
     
     `git push -u origin feature/new-feature`
     
     OR
     
     `git push -u origin eric-feature`

3. **Merging Features**
   - Create a pull request from your feature branch into `dev` on Github.
   - Once reviewed and approved, merge the pull request into `dev`:

    Reviewer can review a branch locally:
   
     **Fetch the Latest Changes**
   
   `git fetch origin`
   
    `git checkout eric-feature`
   
5. **Updating `dev` Branch**
   - Checkout the `dev` branch:

     `git checkout dev`
     
   - Pull (pull is fetches and merges in one commend) the latest changes from `origin dev` to ensure your local `dev` branch is up-to-date:
     
      `git pull origin dev`
