import logging

import typer

# This MUST be imported before any other modules
import dotenv

dotenv.load_dotenv()

from src.models.enrollment import EnrollmentStatus
from src.models.member import MemberStatus


from src.database import Base, engine
from src.models import (
    Course,
    Syllabus,
    CourseSyllabus,
    DocumentType,
    SyllabusItem,
    Member,
    Enrollment,
)

app = typer.Typer()


logger = logging.getLogger(__name__)


@app.command()
def hello_world():
    typer.echo("Hello world!")


@app.command()
def create_seed_data():
    Base.metadata.create_all(bind=engine)

    from src.database import SessionLocal

    db = SessionLocal()

    if db.query(Course).count() > 0:
        typer.echo("Seed data already exists.")
        return

    # Create courses
    typer.echo("Creating courses...")
    private_glider_pilot_zero_to_hero_course = Course(
        name="Private Glider Pilot - Zero to Hero"
    )
    private_glider_pilot_add_on_for_airplane_pilots_course = Course(
        name="Private Glider Pilot - Add-on for Airplane Pilots"
    )
    db.add(private_glider_pilot_zero_to_hero_course)
    db.add(private_glider_pilot_add_on_for_airplane_pilots_course)

    # Create syllabuses
    typer.echo("Creating syllabuses...")
    private_glider_pilot_classroom_lessons_syllabus = Syllabus(
        name="Private Glider Pilot: Classroom Lessons",
        items=[
            SyllabusItem(name="Ground Handling"),
            SyllabusItem(name="Basics of Glider Flight"),
            SyllabusItem(name="Takeoff"),
            SyllabusItem(name="Aerotow"),
            SyllabusItem(name="Landing"),
            SyllabusItem(name="Emergency Procedures"),
        ],
    )
    private_glider_pilot_before_solo_flights_syllabus = Syllabus(
        name="Private Glider Pilot: Before Solo Flights",
        items=[
            SyllabusItem(name="Ground Handling"),
            SyllabusItem(name="Preflight Checks"),
            SyllabusItem(name="The Horizon"),
            SyllabusItem(name="Direct Effects of the Controls"),
            SyllabusItem(name="Secondary Effects of the Controls"),
            SyllabusItem(name="Nose Level and Trim"),
            SyllabusItem(name="Turning and Coordinated Flight"),
            SyllabusItem(name="Straight Flight"),
            SyllabusItem(name="Aerotow"),
            SyllabusItem(name="Landing"),
            SyllabusItem(name="Circuit Planning"),
            SyllabusItem(name="Airbrakes"),
            SyllabusItem(name="Joining too High"),
            SyllabusItem(name="Joining too Low"),
            SyllabusItem(name="Stall"),
            SyllabusItem(name="Low G"),
            SyllabusItem(name="Initial Spin"),
            SyllabusItem(name="Takeoff and Landing in a Crosswind"),
            SyllabusItem(name="Full Spin"),
            SyllabusItem(name="Spiral Dive"),
        ],
    )
    private_glider_pilot_solo_flights_syllabus = Syllabus(
        name="Private Glider Pilot: Solo Flights",
        items=[
            SyllabusItem(name="Flight longer than 30 minutes"),
            SyllabusItem(name="Flight longer than 45 minutes"),
            SyllabusItem(name="Flight longer than 1 hour"),
            SyllabusItem(name="30 degree turns"),
            SyllabusItem(name="45 degree turns"),
            SyllabusItem(name="60 degree turns"),
        ],
    )
    private_glider_pilot_zero_to_hero_theoretical_exams_syllabus = Syllabus(
        name="Private Glider Pilot - Zero to Hero: Theoretical Exams",
        items=[
            SyllabusItem(name="Air Law"),
            SyllabusItem(name="Glider Manual"),
            SyllabusItem(name="General Technical Knowledge"),
            SyllabusItem(name="Meteorology"),
            SyllabusItem(name="Navigation"),
            SyllabusItem(name="Radio Telephony"),
            SyllabusItem(name="Human Performance"),
        ],
    )
    private_glider_pilot_add_on_for_airplane_pilots_theoretical_exams_syllabus = (
        Syllabus(
            name="Private Glider Pilot - Add-on for Airplane Pilots: Theoretical Exams",
            items=[
                SyllabusItem(name="Combined Air Law and General Technical Knowledge"),
                SyllabusItem(name="Glider Manual"),
            ],
        )
    )
    db.add(private_glider_pilot_classroom_lessons_syllabus)
    db.add(private_glider_pilot_before_solo_flights_syllabus)
    db.add(private_glider_pilot_solo_flights_syllabus)
    db.add(private_glider_pilot_zero_to_hero_theoretical_exams_syllabus)
    db.add(private_glider_pilot_add_on_for_airplane_pilots_theoretical_exams_syllabus)

    # Create course syllabuses
    typer.echo("Creating course syllabuses...")
    for item in [
        CourseSyllabus(
            course=private_glider_pilot_zero_to_hero_course,
            syllabus=private_glider_pilot_classroom_lessons_syllabus,
        ),
        CourseSyllabus(
            course=private_glider_pilot_zero_to_hero_course,
            syllabus=private_glider_pilot_before_solo_flights_syllabus,
        ),
        CourseSyllabus(
            course=private_glider_pilot_zero_to_hero_course,
            syllabus=private_glider_pilot_solo_flights_syllabus,
        ),
        CourseSyllabus(
            course=private_glider_pilot_zero_to_hero_course,
            syllabus=private_glider_pilot_zero_to_hero_theoretical_exams_syllabus,
        ),
        CourseSyllabus(
            course=private_glider_pilot_add_on_for_airplane_pilots_course,
            syllabus=private_glider_pilot_classroom_lessons_syllabus,
        ),
        CourseSyllabus(
            course=private_glider_pilot_add_on_for_airplane_pilots_course,
            syllabus=private_glider_pilot_before_solo_flights_syllabus,
        ),
        CourseSyllabus(
            course=private_glider_pilot_add_on_for_airplane_pilots_course,
            syllabus=private_glider_pilot_solo_flights_syllabus,
        ),
        CourseSyllabus(
            course=private_glider_pilot_add_on_for_airplane_pilots_course,
            syllabus=private_glider_pilot_add_on_for_airplane_pilots_theoretical_exams_syllabus,
        ),
    ]:
        db.add(item)

    # Create document types
    medical_document_type = DocumentType(name="Medical")
    student_pilot_license = DocumentType(name="Student Pilot License")
    member_agreement = DocumentType(name="Member Agreement")
    radio_telephony_license = DocumentType(name="Radio Telephony License")
    db.add(medical_document_type)
    db.add(student_pilot_license)
    db.add(member_agreement)
    db.add(radio_telephony_license)

    # Create members
    typer.echo("Creating members...")
    for item in [
        Member(
            name="Amy Vine",
            status=MemberStatus.BEFORE_SOLO_STUDENT,
            enrollments=[
                Enrollment(
                    course=private_glider_pilot_zero_to_hero_course,
                    status=EnrollmentStatus.PENDING,
                ),
            ],
        ),
        Member(
            name="John Doe",
            status=MemberStatus.BEFORE_SOLO_STUDENT,
            enrollments=[
                Enrollment(
                    course=private_glider_pilot_zero_to_hero_course,
                    status=EnrollmentStatus.COURSE_IN_PROGRESS,
                ),
            ],
        ),
        Member(
            name="Jane Eilish",
            status=MemberStatus.BEFORE_SOLO_STUDENT,
            enrollments=[
                Enrollment(
                    course=private_glider_pilot_zero_to_hero_course,
                    status=EnrollmentStatus.COURSE_IN_PROGRESS,
                ),
            ],
        ),
        Member(
            name="Bob Pearl",
            status=MemberStatus.SOLO_STUDENT,
            enrollments=[
                Enrollment(
                    course=private_glider_pilot_zero_to_hero_course,
                    status=EnrollmentStatus.COURSE_IN_PROGRESS,
                ),
            ],
        ),
        Member(
            name="Allie Sherlock",
            status=MemberStatus.PRIVATE_PILOT,
            enrollments=[
                Enrollment(
                    course=private_glider_pilot_zero_to_hero_course,
                    status=EnrollmentStatus.COURSE_COMPLETED,
                ),
            ],
        ),
        Member(name="Robert Kowalski", status=MemberStatus.CFI),
        Member(name="Arianna Smith", status=MemberStatus.CFI),
    ]:
        db.add(item)

    db.commit()


if __name__ == "__main__":
    app()
