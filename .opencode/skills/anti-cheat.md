Implement an ADVANCED anti-cheating and behavioral proctoring system for the MERN blind coding platform.

Focus ONLY on advanced detection, monitoring, scoring, backend validation, analytics, and automated punishment systems.

Monitoring MUST ONLY RUN:

* after contestant enters coding round
* while editor is active

Monitoring MUST STOP:

* after submission
* round timeout
* navigation away
* disqualification
* leaving coding page

Do NOT monitor users globally across the site.

Build a real anti-cheating engine with:

* probabilistic scoring
* behavioral analysis
* live monitoring
* server-side validation
* automatic penalties
* admin analytics

Track:

* window blur
* visibility change
* tab switch
* minimize
* fullscreen exit
* multi-tab usage
* duplicate contest sessions
* refresh abuse
* suspicious resize
* split-screen heuristics
* second monitor heuristics
* excessive focus loss
* inactivity abuse
* repeated reconnects
* browser zoom changes
* network disconnect patterns
* devtools open detection
* abnormal behavior bursts

Implement:

* BroadcastChannel
  OR
* localStorage heartbeat sync

Detect:

* multiple tabs open for same contest
* concurrent sessions
* session duplication

Immediate suspicion spike.

Implement advanced detection:

* debugger timing
* window size anomalies
* devtools dimension heuristics
* console timing tricks

DO NOT rely on one technique only.

Create weighted scoring system.

Example:
blur -> +5
tab hidden -> +8
fullscreen exit -> +10
multi-tab -> +40
devtools -> +35
split screen -> +20

Repeated violations should increase exponentially.

Implement:

* score decay over time
* forgiveness for accidental actions
* event history

SAFE
0-24

SUSPICIOUS
25-49

DOUBTFUL
50-79

CONFIRMED CHEATING
80+

Also calculate:

* cheat probability %
* confidence %
* trust score

SAFE:

* no action

SUSPICIOUS:

* warning popup

DOUBTFUL:

* deduct points
* restrict executions
* notify admin

CONFIRMED:

* auto-submit code
* freeze editor
* ban/disqualify
* lock contest participation

Create:

* cheat logs schema
* monitoring controller
* anti-cheat service
* event ingestion API
* suspicion aggregation engine

Store:

* participantId
* round
* timestamp
* event type
* score impact
* browser info
* confidence
* metadata
* session id

Backend MUST validate:

* impossible behavior
* spam events
* bypass attempts
* tampering

Never trust frontend alone.

Detect:

* removed listeners
* overridden functions
* disabled monitoring
* modified localStorage
* heartbeat interruption

If tampering detected:
massive suspicion increase.

Use:

* socket.io OR polling

Admin panel should update LIVE.

Create:

* live suspicious users table
* realtime event feed
* cheating probability meters
* heatmaps
* suspicion graphs
* violation timeline
* user behavior analytics
* active monitoring sessions

Admins should see:

* current status
* live suspicion score
* risk category
* all violations
* timestamps
* browser metadata

Create:

* useAntiCheat hook
* monitoring service
* event dispatcher
* session tracker
* heartbeat system

Integrate with:

* coding round lifecycle
* submit flow
* timeout flow
* disqualification flow

Provide COMPLETE production-ready code:

* frontend
* backend
* routes
* middleware
* hooks
* services
* models
* admin pages
* integrations

DO NOT GIVE:

* pseudocode
* placeholders
* incomplete snippets

Build the FULL integrated system properly for the existing MERN blind coding platform.

and also do the needful which you think is the right approach according to the already existing project
