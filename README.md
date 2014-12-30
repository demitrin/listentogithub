listentogithub
===========

Watch and listen to Github in real time.

Here's the shit that we gotta do.

### Basic functionality

- [x] Make node server
- [x] Connect to Github and get some sort of feed.
- [x] Sync Github data with socket.io.
- [ ] Sounds with HowlerJS
- [ ] Visualization with D3
- [ ] Deploy to Heroku

### Extensions

- [ ] Some shit with hardware. (Maybe lights that flash for every commit or some
shit?

### Notes on the viz

Visually, if we do things the way listenToWikipedia does, we've got several
things to work with: color, size, and position.

One cool idea is to calculate those things deterministically by giving users
and repositories a certain "score" for, like, the top few thousand of each.

But, the simplest possible way is to pick these all at random on the server to
maintain consistency.

### Some notes on Github Events.

There are a bunch of types of Github events. We don't care about all of them.
Here's a list of the events and whether or not we care about them.

The events we care about: ForkEvent, IssuesEvent, PublicEvent,
PullRequestEvent, PushEvent, ReleaseEvent, RepositoryEvent, WatchEvent

- **CreateEvent**: Represents a created repository, branch, or tag. I think we
  care, at least about repositories.
- **ForkEvent**: Yeah we care!!
- **PublicEvent**: Yeah we care!!
- **WatchEvent**: hmm. I think we do care.


- **CommitCommentEvent**: Comments on commits. We don't care.
- **DeleteEvent**: Deleted branch or tag. I don't think we care.
- **DeploymentEvent**: Are these even public? Nah we don't care.
- **DeploymentStatusEvent**: Same answer. I don't think we care.
- **DownloadEvent**: We don't care.
- **FollowEvent**: We don't care.
- **ForkApplyEvent**: These aren't even created anymore.
- **GistEvent**: These are not created anymore.
- **GollumEvent**: Wiki updates. we. don't. care.
- **IssueCommentEvent**: Maybe we care.
- **IssuesEvent**: Yeah we care!!
- **MemberEvent**: I think not.
- **MembershipEvent**: Not public I think.
- **PageBuildEvent**: We don't care.
- **PullRequestEvent**: I think we care.
- **PullRequestReviewCommentEvent**: I do not think we care.
- **PushEvent**: This is what we came here for.
- **ReleaseEvent**: Yeah we care!!
- **RepositoryEvent**: repo creation. Yes we care. Not sure we get it though.
- **StatusEvent**: I don't think we care.
- **TeamAddEvent**: I don't think we care.


